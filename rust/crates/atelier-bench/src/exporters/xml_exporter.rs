//! Flat element-per-row document.

use crate::contracts::exporter_contract::ExporterContract;
use crate::contracts::report_contract::ReportRow;
use crate::support::abstract_exporter::ExporterBase;

/// Flat element-per-row document.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct XmlExporter {
    base: ExporterBase,
}

impl XmlExporter {
    pub const fn new() -> Self {
        Self {
            base: ExporterBase::new("xml", "application/xml"),
        }
    }

    /// Shared extension/mime pair and the cent formatter.
    pub const fn base(&self) -> &ExporterBase {
        &self.base
    }
}

impl Default for XmlExporter {
    fn default() -> Self {
        Self::new()
    }
}

impl ExporterContract for XmlExporter {
    fn extension(&self) -> &'static str {
        self.base.extension
    }

    fn mime(&self) -> &'static str {
        self.base.mime
    }

    fn export(&self, rows: &[ReportRow]) -> String {
        let body = rows
            .iter()
            .map(|row| format!("<row label=\"{}\" cents=\"{}\"/>", row.label, row.cents))
            .collect::<Vec<_>>()
            .join("");

        format!("<rows>{body}</rows>")
    }
}
