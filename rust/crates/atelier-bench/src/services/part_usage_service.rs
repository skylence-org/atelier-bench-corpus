//! Part consumption roll-up.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Part consumption roll-up.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PartUsageService {
    base: ServiceBase,
}

impl PartUsageService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "part-usage";

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

    /// Units consumed across the whole catalogue.
    pub fn consumed_units(&self, data: &Dataset) -> u32 {
        data.parts.iter().map(|part| part.consumed_quantity()).sum()
    }
}

impl Default for PartUsageService {
    fn default() -> Self {
        Self::new()
    }
}
