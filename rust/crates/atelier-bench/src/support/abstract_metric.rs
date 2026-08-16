//! Base shared by all 16 metrics.

use crate::concerns::has_logging::HasLogging;
use crate::contracts::metric_contract::MetricUnit;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct MetricBase {
    pub key: &'static str,
    pub unit: MetricUnit,
}

impl MetricBase {
    pub const fn new(key: &'static str, unit: MetricUnit) -> Self {
        Self { key, unit }
    }
}

impl HasLogging for MetricBase {
    fn log_target(&self) -> &'static str {
        self.key
    }
}
