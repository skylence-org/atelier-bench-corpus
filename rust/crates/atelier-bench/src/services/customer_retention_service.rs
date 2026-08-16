//! Repeat-business share.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Repeat-business share.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CustomerRetentionService {
    base: ServiceBase,
}

impl CustomerRetentionService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "customer-retention";

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

    /// Share of customers with more than one order.
    pub fn rate(&self, data: &Dataset) -> f64 {
        if data.customers.is_empty() {
            return 0.0;
        }

        let repeat = data
            .customers
            .iter()
            .filter(|customer| data.orders_for(customer.id).len() > 1)
            .count();

        repeat as f64 / data.customers.len() as f64
    }
}

impl Default for CustomerRetentionService {
    fn default() -> Self {
        Self::new()
    }
}
