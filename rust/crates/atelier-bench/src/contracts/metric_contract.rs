//! Single-number contract.

use crate::dataset::Dataset;

/// What a metric's number means.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MetricUnit {
    Count,
    Cents,
    Percent,
    Days,
}

impl MetricUnit {
    pub fn suffix(&self) -> &'static str {
        match self {
            MetricUnit::Count => "",
            MetricUnit::Cents => " c",
            MetricUnit::Percent => "%",
            MetricUnit::Days => " d",
        }
    }
}

/// One scalar computed over the whole dataset.
pub trait MetricContract: Send + Sync {
    /// Registry key, unique across the lane.
    fn key(&self) -> &'static str;

    fn unit(&self) -> MetricUnit;

    /// The number itself.
    fn compute(&self, data: &Dataset) -> f64;

    /// Display form with the unit suffix appended.
    fn formatted(&self, data: &Dataset) -> String {
        format!("{:.2}{}", self.compute(data), self.unit().suffix())
    }
}
