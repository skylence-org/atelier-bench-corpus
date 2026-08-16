//! Surcharging binding for [`crate::contracts::invoice_calculator::InvoiceCalculator`].

use crate::contracts::invoice_calculator::InvoiceCalculator;
use crate::models::repair_order::RepairOrder;
use crate::money::Money;
use crate::services::standard_invoice_calculator::StandardInvoiceCalculator;

/// Wraps the standard strategy and adds the priority surcharge on top.
#[derive(Debug, Clone, Copy, Default)]
pub struct RushInvoiceCalculator {
    inner: StandardInvoiceCalculator,
    surcharge_enabled: bool,
}

impl RushInvoiceCalculator {
    /// Feature-flag gate: mirrors a runtime flag lookup in the PHP lane.
    pub const FLAG: &'static str = "rush-surcharge";

    pub fn enabled() -> Self {
        Self {
            inner: StandardInvoiceCalculator::default(),
            surcharge_enabled: true,
        }
    }
}

impl InvoiceCalculator for RushInvoiceCalculator {
    fn calculate(&self, order: &RepairOrder) -> Money {
        let base = self.inner.calculate(order);
        if !self.surcharge_enabled || !order.priority.is_billable() {
            return base;
        }

        base.with_surcharge_bp(order.priority.surcharge_bp())
    }

    fn name(&self) -> &'static str {
        "rush"
    }

    fn applies_surcharge(&self) -> bool {
        self.surcharge_enabled
    }
}
