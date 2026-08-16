//! Pipe table with a header rule.

use crate::contracts::exporter_contract::ExporterContract;
use crate::contracts::formatter_contract::FormatterContract;
use crate::contracts::report_contract::ReportRow;
use crate::support::abstract_exporter::ExporterBase;

/// Pipe table with a header rule.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct MarkdownExporter {
    base: ExporterBase,
}

impl MarkdownExporter {
    pub const fn new() -> Self {
        Self {
            base: ExporterBase::new("md", "text/markdown"),
        }
    }

    /// Shared extension/mime pair and the cent formatter.
    pub const fn base(&self) -> &ExporterBase {
        &self.base
    }
}

impl Default for MarkdownExporter {
    fn default() -> Self {
        Self::new()
    }
}

impl ExporterContract for MarkdownExporter {
    fn extension(&self) -> &'static str {
        self.base.extension
    }

    fn mime(&self) -> &'static str {
        self.base.mime
    }

    fn export(&self, rows: &[ReportRow]) -> String {
        let mut out = vec![
            "| label | amount |".to_string(),
            "| --- | --- |".to_string(),
        ];
        out.extend(
            rows.iter()
                .map(|row| format!("| {} | {} |", row.label, self.base.format_cents(row.cents))),
        );

        out.join("\n")
    }
}
