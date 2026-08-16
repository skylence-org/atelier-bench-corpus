//! The central aggregate.

use crate::concerns::has_reference::HasReference;
use crate::container::Container;
use crate::errors::AtelierError;
use crate::models::part::Part;
use crate::money::Money;
use crate::support::priority::Priority;
use crate::support::status::RepairStatus;
use serde::{Deserialize, Serialize};

/// One part line on an order.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct OrderPart {
    pub part_id: u32,
    pub sku: String,
    pub quantity: u32,
    pub unit_price: Money,
}

/// Append-only lifecycle entry.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct StatusChange {
    pub from: RepairStatus,
    pub to: RepairStatus,
    pub changed_by: String,
}

/// A repair job: device in, invoice out.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct RepairOrder {
    pub id: u32,
    pub customer_id: u32,
    pub device_id: u32,
    pub status: RepairStatus,
    pub priority: Priority,
    pub labor_minutes: u32,
    pub parts: Vec<OrderPart>,
    pub log: Vec<StatusChange>,
    pub reference_number: u32,
}

impl RepairOrder {
    pub fn new(id: u32, customer_id: u32, device_id: u32) -> Self {
        Self {
            id,
            customer_id,
            device_id,
            status: RepairStatus::Received,
            priority: Priority::Standard,
            labor_minutes: 0,
            parts: Vec::new(),
            log: Vec::new(),
            reference_number: id,
        }
    }

    pub fn with_priority(mut self, priority: Priority) -> Self {
        self.priority = priority;
        self
    }

    pub fn with_labor(mut self, minutes: u32) -> Self {
        self.labor_minutes = minutes;
        self
    }

    /// Move to `next` when the lifecycle allows it, logging the change.
    pub fn transition_to(&mut self, next: RepairStatus, changed_by: &str) -> bool {
        if !self.status.transitions_to().contains(&next) {
            return false;
        }

        self.log.push(StatusChange {
            from: self.status,
            to: next,
            changed_by: changed_by.to_string(),
        });
        self.status = next;

        true
    }

    /// Drive the order to `Completed`, refusing an illegal jump.
    pub fn complete(&mut self, changed_by: &str) -> Result<(), AtelierError> {
        if !self.transition_to(RepairStatus::Completed, changed_by) {
            return Err(AtelierError::IllegalTransition {
                from: self.status,
                to: RepairStatus::Completed,
            });
        }

        Ok(())
    }

    /// Parts-only subtotal; labour is the calculator's business.
    pub fn parts_subtotal(&self) -> Money {
        self.parts
            .iter()
            .map(|line| line.unit_price * i64::from(line.quantity))
            .sum()
    }

    /// Total through the bound strategy: the concrete calculator is decided
    /// by the container, never by this call site.
    pub fn total(&self, container: &Container) -> Money {
        container.invoice_calculator().calculate(self)
    }

    /// Attach a part line, priced from the stock record.
    pub fn add_part(&mut self, part: &Part, quantity: u32) {
        self.parts.push(OrderPart {
            part_id: part.id,
            sku: part.sku.clone(),
            quantity,
            unit_price: part.unit_price,
        });
    }

    /// Still occupying bench space?
    pub fn is_open(&self) -> bool {
        self.status.is_open()
    }
}

impl HasReference for RepairOrder {
    fn reference_number(&self) -> u32 {
        self.reference_number
    }
}
