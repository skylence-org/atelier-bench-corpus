//! Minimal table markup.

use crate::contracts::exporter_contract::ExporterContract;
use crate::contracts::formatter_contract::FormatterContract;
use crate::contracts::report_contract::ReportRow;
use crate::support::abstract_exporter::ExporterBase;

/// Minimal table markup.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct HtmlExporter {
    base: ExporterBase,
}

impl HtmlExporter {
    pub const fn new() -> Self {
        Self {
            base: ExporterBase::new("html", "text/html"),
        }
    }

    /// Shared extension/mime pair and the cent formatter.
    pub const fn base(&self) -> &ExporterBase {
        &self.base
    }
}

impl Default for HtmlExporter {
    fn default() -> Self {
        Self::new()
    }
}

impl ExporterContract for HtmlExporter {
    fn extension(&self) -> &'static str {
        self.base.extension
    }

    fn mime(&self) -> &'static str {
        self.base.mime
    }

    fn export(&self, rows: &[ReportRow]) -> String {
        let body = rows
            .iter()
            .map(|row| {
                format!(
                    "<tr><td>{}</td><td>{}</td></tr>",
                    row.label,
                    self.base.format_cents(row.cents)
                )
            })
            .collect::<Vec<_>>()
            .join("");

        format!("<table>{body}</table>")
    }
}
