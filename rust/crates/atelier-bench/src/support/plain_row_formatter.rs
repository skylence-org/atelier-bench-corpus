//! Structural look-alike: the method set of [`HasFormatting`] with no impl.
//!
//! `PlainRowFormatter` declares `format_value` and `format_label` inherently
//! and never names the trait. It is NOT a
//! [`crate::concerns::has_formatting::HasFormatting`] implementor: rust has no
//! structural conformance, and the blanket
//! `impl<T: ReportContract> HasFormatting for T` does not reach it either,
//! because this type implements no contract at all.

/// Renders report cells without going through any contract.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub struct PlainRowFormatter;

impl PlainRowFormatter {
    /// Same signature as `HasFormatting::format_value`, declared inherently.
    pub fn format_value(&self, value: f64) -> String {
        format!("{value:.2}")
    }

    /// Same signature as `HasFormatting::format_label`, declared inherently.
    pub fn format_label(&self, label: &str) -> String {
        label.trim().to_string()
    }
}
