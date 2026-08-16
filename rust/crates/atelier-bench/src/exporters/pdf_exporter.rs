//! Header-only stand-in: the corpus never renders real PDFs.

use crate::contracts::exporter_contract::ExporterContract;
use crate::contracts::report_contract::ReportRow;
use crate::support::abstract_exporter::ExporterBase;

/// Header-only stand-in: the corpus never renders real PDFs.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PdfExporter {
    base: ExporterBase,
}

impl PdfExporter {
    pub const fn new() -> Self {
        Self {
            base: ExporterBase::new("pdf", "application/pdf"),
        }
    }

    /// Shared extension/mime pair and the cent formatter.
    pub const fn base(&self) -> &ExporterBase {
        &self.base
    }
}

impl Default for PdfExporter {
    fn default() -> Self {
        Self::new()
    }
}

impl ExporterContract for PdfExporter {
    fn extension(&self) -> &'static str {
        self.base.extension
    }

    fn mime(&self) -> &'static str {
        self.base.mime
    }

    fn export(&self, rows: &[ReportRow]) -> String {
        format!("%PDF-1.7\n% {} row(s)\n%%EOF", rows.len())
    }
}
