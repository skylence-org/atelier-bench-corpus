//! Blanket concern.
//!
//! Every [`ReportContract`] implementor gets these methods without naming this
//! trait: a `format_value` call site has no impl block to jump to, only the
//! blanket impl below.

use crate::contracts::report_contract::ReportContract;

pub trait HasFormatting {
    /// Two-decimal rendering used by every report footer.
    fn format_value(&self, value: f64) -> String {
        format!("{value:.2}")
    }

    fn format_label(&self, label: &str) -> String {
        label.trim().to_string()
    }
}

impl<T: ReportContract> HasFormatting for T {}
