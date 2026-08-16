//! Revenue roll-up and the parallel metric sweep.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;
use rayon::prelude::*;

/// Revenue roll-up and the parallel metric sweep.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RevenueService {
    base: ServiceBase,
}

impl RevenueService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "revenue";

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

    /// Invoiced revenue in cents.
    pub fn total_cents(&self, data: &Dataset) -> i64 {
        data.revenue_cents()
    }

    /// Compute every registered metric in parallel.
    ///
    /// The only rayon call site in the lane: the registry is a `Vec` of trait
    /// objects, so this also proves `MetricContract: Send + Sync`.
    pub fn metric_sweep(&self, data: &Dataset) -> Vec<(&'static str, f64)> {
        crate::METRICS
            .par_iter()
            .map(|metric| (metric.key(), metric.compute(data)))
            .collect()
    }
}

impl Default for RevenueService {
    fn default() -> Self {
        Self::new()
    }
}
