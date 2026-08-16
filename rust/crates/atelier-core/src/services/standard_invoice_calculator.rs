//! Default binding for [`crate::contracts::invoice_calculator::InvoiceCalculator`].

use crate::contracts::invoice_calculator::InvoiceCalculator;
use crate::models::repair_order::RepairOrder;
use crate::money::Money;

/// Labour plus parts, no surcharge.
#[derive(Debug, Clone, Copy, Default)]
pub struct StandardInvoiceCalculator {
    labour_rate_cents_per_hour: i64,
}

impl StandardInvoiceCalculator {
    pub const DEFAULT_RATE_CENTS: i64 = 7_500;

    pub fn new(labour_rate_cents_per_hour: i64) -> Self {
        Self {
            labour_rate_cents_per_hour,
        }
    }

    fn labour(&self, order: &RepairOrder) -> Money {
        let rate = if self.labour_rate_cents_per_hour == 0 {
            Self::DEFAULT_RATE_CENTS
        } else {
            self.labour_rate_cents_per_hour
        };

        Money(rate * i64::from(order.labor_minutes) / 60)
    }
}

impl InvoiceCalculator for StandardInvoiceCalculator {
    fn calculate(&self, order: &RepairOrder) -> Money {
        self.labour(order) + order.parts_subtotal()
    }

    fn name(&self) -> &'static str {
        "standard"
    }
}
