//! Sheet stand-in listing cell coordinates.

use crate::contracts::exporter_contract::ExporterContract;
use crate::contracts::report_contract::ReportRow;
use crate::support::abstract_exporter::ExporterBase;

/// Sheet stand-in listing cell coordinates.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct XlsxExporter {
    base: ExporterBase,
}

impl XlsxExporter {
    pub const fn new() -> Self {
        Self {
            base: ExporterBase::new(
                "xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ),
        }
    }

    /// Shared extension/mime pair and the cent formatter.
    pub const fn base(&self) -> &ExporterBase {
        &self.base
    }
}

impl Default for XlsxExporter {
    fn default() -> Self {
        Self::new()
    }
}

impl ExporterContract for XlsxExporter {
    fn extension(&self) -> &'static str {
        self.base.extension
    }

    fn mime(&self) -> &'static str {
        self.base.mime
    }

    fn export(&self, rows: &[ReportRow]) -> String {
        rows.iter()
            .enumerate()
            .map(|(index, row)| {
                format!("A{}={} B{}={}", index + 1, row.label, index + 1, row.cents)
            })
            .collect::<Vec<_>>()
            .join(";")
    }
}
