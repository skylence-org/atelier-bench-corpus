//! Deterministic in-memory dataset.
//!
//! Fixed rows, no randomness: the corpus must produce identical numbers on
//! every machine so bench expectations can hard-code them.

use atelier_core::models::invoice::Invoice;
use atelier_core::models::repair_order::RepairOrder;
use atelier_core::money::Money;
use atelier_core::support::priority::Priority;
use atelier_core::support::status::RepairStatus;
use atelier_core::{Customer, Device, Part, Technician};
use serde::Serialize;

/// Everything a report, metric or service reads from.
#[derive(Debug, Clone, Default, Serialize)]
pub struct Dataset {
    pub customers: Vec<Customer>,
    pub devices: Vec<Device>,
    pub orders: Vec<RepairOrder>,
    pub parts: Vec<Part>,
    #[serde(skip)]
    pub technicians: Vec<Technician>,
    pub invoices: Vec<Invoice>,
}

impl Dataset {
    /// The frozen seed. Changing these rows changes bench ground truth.
    pub fn seeded() -> Self {
        let customers = vec![
            Customer::new(1, "Ada Byron", "ada@example.test").with_phone("+32 470 00 00 01"),
            Customer::new(2, "Grace Hopper", "grace@example.test"),
            Customer::new(3, "Alan Turing", "alan@example.test").with_phone("+32 470 00 00 03"),
        ];

        let devices = vec![
            Device::new(1, 1, "Framework", "13").with_serial("SER-0001"),
            Device::new(2, 2, "Lenovo", "X1").with_serial("SER-0002"),
            Device::new(3, 3, "Apple", "MBP 14"),
        ];

        let parts = vec![
            Part::new(1, "SCR-13", "Screen 13\"", Money(19_900)).with_stock(4),
            Part::new(2, "BAT-55", "Battery 55Wh", Money(8_900)).with_stock(1),
            Part::new(3, "KBD-EU", "Keyboard EU", Money(6_400)).with_stock(7),
            Part::new(4, "FAN-A1", "Cooling fan", Money(2_200)).with_stock(2),
        ];

        let technicians = vec![
            Technician::new(1, "Nel"),
            Technician::new(2, "Rik"),
            Technician::new(3, "Sam"),
        ];

        let mut orders = vec![
            RepairOrder::new(1, 1, 1).with_labor(120),
            RepairOrder::new(2, 2, 2)
                .with_priority(Priority::Rush)
                .with_labor(45),
            RepairOrder::new(3, 3, 3)
                .with_priority(Priority::Warranty)
                .with_labor(90),
            RepairOrder::new(4, 1, 1).with_labor(30),
        ];

        orders[0].add_part(&parts[0], 1);
        orders[0].transition_to(RepairStatus::Diagnosing, "seeder");
        orders[0].transition_to(RepairStatus::Repairing, "seeder");
        orders[0].transition_to(RepairStatus::Completed, "seeder");

        orders[1].add_part(&parts[1], 2);
        orders[1].transition_to(RepairStatus::Diagnosing, "seeder");
        orders[1].transition_to(RepairStatus::AwaitingParts, "seeder");

        orders[2].add_part(&parts[2], 1);
        orders[2].add_part(&parts[3], 1);
        orders[2].transition_to(RepairStatus::Diagnosing, "seeder");
        orders[2].transition_to(RepairStatus::Repairing, "seeder");

        let invoices = vec![
            Invoice::new(1, 1, Money(34_900)),
            Invoice::new(2, 2, Money(23_425)),
        ];

        Self {
            customers,
            devices,
            orders,
            parts,
            technicians,
            invoices,
        }
    }

    /// Orders that have reached a billable end state.
    pub fn completed_orders(&self) -> Vec<&RepairOrder> {
        self.orders
            .iter()
            .filter(|order| !order.status.is_open())
            .collect()
    }

    /// Orders still occupying bench space.
    pub fn open_orders(&self) -> Vec<&RepairOrder> {
        self.orders.iter().filter(|order| order.is_open()).collect()
    }

    pub fn orders_for(&self, customer_id: u32) -> Vec<&RepairOrder> {
        self.orders
            .iter()
            .filter(|order| order.customer_id == customer_id)
            .collect()
    }

    pub fn part(&self, sku: &str) -> Option<&Part> {
        self.parts.iter().find(|part| part.sku == sku)
    }

    pub fn low_stock_parts(&self) -> Vec<&Part> {
        self.parts
            .iter()
            .filter(|part| part.is_low_stock())
            .collect()
    }

    /// Sum of every issued invoice, in cents.
    pub fn revenue_cents(&self) -> i64 {
        self.invoices
            .iter()
            .map(|invoice| invoice.total.cents())
            .sum()
    }

    /// Sum of every part line across every order, in cents.
    pub fn parts_cost_cents(&self) -> i64 {
        self.orders
            .iter()
            .map(|order| order.parts_subtotal().cents())
            .sum()
    }

    pub fn labour_minutes(&self) -> u32 {
        self.orders.iter().map(|order| order.labor_minutes).sum()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn seed_is_frozen() {
        let data = Dataset::seeded();

        assert_eq!(data.orders.len(), 4);
        assert_eq!(data.completed_orders().len(), 1);
        assert_eq!(data.revenue_cents(), 58_325);
        assert_eq!(data.low_stock_parts().len(), 2);
    }
}
