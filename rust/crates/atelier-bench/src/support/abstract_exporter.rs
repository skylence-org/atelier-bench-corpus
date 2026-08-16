//! Base shared by all 8 exporters.

use crate::contracts::formatter_contract::FormatterContract;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ExporterBase {
    pub extension: &'static str,
    pub mime: &'static str,
}

impl ExporterBase {
    pub const fn new(extension: &'static str, mime: &'static str) -> Self {
        Self { extension, mime }
    }
}

impl FormatterContract for ExporterBase {
    fn format_cents(&self, cents: i64) -> String {
        let sign = if cents < 0 { "-" } else { "" };
        let abs = cents.abs();

        format!("{sign}{}.{:02}", abs / 100, abs % 100)
    }
}
