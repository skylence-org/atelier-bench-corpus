//! The widest contract in the lane: two dozen implementors.

use crate::dataset::Dataset;
use serde::Serialize;

/// One rendered row: a label, a numeric value and its exact cent amount.
#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct ReportRow {
    pub label: String,
    pub value: f64,
    pub cents: i64,
}

impl ReportRow {
    /// Row whose cent amount is derived from `value`.
    pub fn new(label: impl Into<String>, value: f64) -> Self {
        Self {
            label: label.into(),
            value,
            cents: (value * 100.0).round() as i64,
        }
    }

    /// Row built straight from an exact cent amount.
    pub fn from_cents(label: impl Into<String>, cents: i64) -> Self {
        Self {
            label: label.into(),
            value: cents as f64 / 100.0,
            cents,
        }
    }
}

/// Anything that renders rows out of a [`Dataset`].
pub trait ReportContract: Send + Sync {
    /// Stable identifier used in URLs and the report registry.
    fn slug(&self) -> &'static str;

    /// Human title for the report header.
    fn title(&self) -> &'static str;

    /// The rendered body.
    fn rows(&self, data: &Dataset) -> Vec<ReportRow>;

    /// Sum of every row value; overridden by reports that average instead.
    fn total(&self, data: &Dataset) -> f64 {
        self.rows(data).iter().map(|row| row.value).sum()
    }

    fn is_empty(&self, data: &Dataset) -> bool {
        self.rows(data).is_empty()
    }
}
