//! Open-order counting.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Open-order counting.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BacklogService {
    base: ServiceBase,
}

impl BacklogService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "backlog";

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

    /// How many orders are still on the bench.
    pub fn depth(&self, data: &Dataset) -> usize {
        data.open_orders().len()
    }

    /// Deepest lifecycle state currently occupied.
    pub fn deepest_state(&self, data: &Dataset) -> Option<&'static str> {
        data.open_orders()
            .iter()
            .map(|order| order.status.label())
            .next_back()
    }
}

impl Default for BacklogService {
    fn default() -> Self {
        Self::new()
    }
}
