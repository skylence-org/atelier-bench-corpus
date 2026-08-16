//! Comma-separated rows, one line each.

use crate::contracts::exporter_contract::ExporterContract;
use crate::contracts::formatter_contract::FormatterContract;
use crate::contracts::report_contract::ReportRow;
use crate::support::abstract_exporter::ExporterBase;

/// Comma-separated rows, one line each.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CsvExporter {
    base: ExporterBase,
}

impl CsvExporter {
    pub const fn new() -> Self {
        Self {
            base: ExporterBase::new("csv", "text/csv"),
        }
    }

    /// Shared extension/mime pair and the cent formatter.
    pub const fn base(&self) -> &ExporterBase {
        &self.base
    }
}

impl Default for CsvExporter {
    fn default() -> Self {
        Self::new()
    }
}

impl ExporterContract for CsvExporter {
    fn extension(&self) -> &'static str {
        self.base.extension
    }

    fn mime(&self) -> &'static str {
        self.base.mime
    }

    fn export(&self, rows: &[ReportRow]) -> String {
        rows.iter()
            .map(|row| format!("{},{}", row.label, self.base.format_cents(row.cents)))
            .collect::<Vec<_>>()
            .join("\n")
    }
}
