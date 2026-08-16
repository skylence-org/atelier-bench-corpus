//! Mean booked share across the bench.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Mean booked share across the bench.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TechnicianUtilizationMetric {
    base: MetricBase,
}

impl TechnicianUtilizationMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "technician-utilization";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Percent),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for TechnicianUtilizationMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for TechnicianUtilizationMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        if data.technicians.is_empty() {
            return 0.0;
        }

        let total: f64 = data
            .technicians
            .iter()
            .map(|technician| technician.utilisation())
            .sum();

        total / data.technicians.len() as f64
    }
}
