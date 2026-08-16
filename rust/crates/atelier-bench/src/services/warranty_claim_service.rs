//! Warranty intake share.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;
use atelier_core::support::priority::Priority;

/// Warranty intake share.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WarrantyClaimService {
    base: ServiceBase,
}

impl WarrantyClaimService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "warranty-claim";

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

    /// Orders taken in under warranty.
    pub fn count(&self, data: &Dataset) -> usize {
        data.orders
            .iter()
            .filter(|order| order.priority == Priority::Warranty)
            .count()
    }
}

impl Default for WarrantyClaimService {
    fn default() -> Self {
        Self::new()
    }
}
