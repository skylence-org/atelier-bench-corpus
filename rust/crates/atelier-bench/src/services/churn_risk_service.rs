//! Customers at risk of not returning.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Customers at risk of not returning.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ChurnRiskService {
    base: ServiceBase,
}

impl ChurnRiskService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "churn-risk";

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

    /// Customers with no open order at all.
    pub fn at_risk(&self, data: &Dataset) -> Vec<u32> {
        data.customers
            .iter()
            .filter(|customer| data.orders_for(customer.id).iter().all(|o| !o.is_open()))
            .map(|customer| customer.id)
            .collect()
    }
}

impl Default for ChurnRiskService {
    fn default() -> Self {
        Self::new()
    }
}
