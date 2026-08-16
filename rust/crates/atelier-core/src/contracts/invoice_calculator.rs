//! The contract behind the container binding.

use crate::models::repair_order::RepairOrder;
use crate::money::Money;

/// Total-price strategy. Two implementations live in [`crate::services`];
/// the container decides which one an order sees.
pub trait InvoiceCalculator: Send + Sync {
    /// Total payable for `order`, surcharges included.
    fn calculate(&self, order: &RepairOrder) -> Money;

    /// Strategy name, used in report footers and logs.
    fn name(&self) -> &'static str {
        "invoice-calculator"
    }

    /// Does this strategy apply a priority surcharge at all?
    fn applies_surcharge(&self) -> bool {
        false
    }
}
