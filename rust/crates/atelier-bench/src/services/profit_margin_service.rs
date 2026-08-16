//! Margin after part cost.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Margin after part cost.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProfitMarginService {
    base: ServiceBase,
}

impl ProfitMarginService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "profit-margin";

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

    /// Margin as a share of revenue.
    pub fn ratio(&self, data: &Dataset) -> f64 {
        let revenue = data.revenue_cents() as f64;
        if revenue == 0.0 {
            return 0.0;
        }

        (revenue - data.parts_cost_cents() as f64) / revenue
    }
}

impl Default for ProfitMarginService {
    fn default() -> Self {
        Self::new()
    }
}
