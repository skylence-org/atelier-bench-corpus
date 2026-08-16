//! Reporting-side formatter.
//!
//! Shadow pair: [`crate::billing::formatter::Formatter`] has the same type
//! name but an unrelated method set.

use crate::support::status::RepairStatus;

/// Formats lifecycle state for the customer-facing report.
#[derive(Debug, Clone, Default)]
pub struct Formatter {
    locale: String,
}

impl Formatter {
    pub fn new(locale: impl Into<String>) -> Self {
        Self {
            locale: locale.into(),
        }
    }

    /// One-line status sentence, with an optional "since" suffix.
    pub fn status_line(&self, status: RepairStatus, since: Option<&str>) -> String {
        match since {
            Some(since) => format!("{} since {since}", status.label()),
            None => status.label().to_string(),
        }
    }

    /// Locale tag echoed into the report footer.
    pub fn locale(&self) -> &str {
        if self.locale.is_empty() {
            "en"
        } else {
            self.locale.as_str()
        }
    }
}
