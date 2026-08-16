//! Completed-order counting.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Completed-order counting.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ThroughputService {
    base: ServiceBase,
}

impl ThroughputService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "throughput";

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

    /// Orders that reached a billable end state.
    pub fn completed(&self, data: &Dataset) -> usize {
        data.completed_orders().len()
    }
}

impl Default for ThroughputService {
    fn default() -> Self {
        Self::new()
    }
}
