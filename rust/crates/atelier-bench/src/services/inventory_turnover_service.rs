//! Consumption against shelf depth.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Consumption against shelf depth.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct InventoryTurnoverService {
    base: ServiceBase,
}

impl InventoryTurnoverService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "inventory-turnover";

    pub fn new() -> Self {
        Self {
            base: ServiceBase::new(Self::NAME),
        }
    }

    /// Shared audit trail.
    pub fn base(&self) -> &ServiceBase {
        &self.base
    }

    /// Mutable access so callers can record their own actions.
    pub fn base_mut(&mut self) -> &mut ServiceBase {
        &mut self.base
    }

    /// Turnover for one sku, or `None` when the sku is unknown.
    pub fn for_sku(&self, data: &Dataset, sku: &str) -> Option<f64> {
        let part = data.part(sku)?;
        if part.stock == 0 {
            return Some(0.0);
        }

        Some(f64::from(part.consumed_quantity()) / f64::from(part.stock))
    }
}

impl Default for InventoryTurnoverService {
    fn default() -> Self {
        Self::new()
    }
}
