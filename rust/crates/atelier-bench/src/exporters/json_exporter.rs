//! Serde rendering of the row structs.

use crate::contracts::exporter_contract::ExporterContract;
use crate::contracts::report_contract::ReportRow;
use crate::support::abstract_exporter::ExporterBase;

/// Serde rendering of the row structs.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct JsonExporter {
    base: ExporterBase,
}

impl JsonExporter {
    pub const fn new() -> Self {
        Self {
            base: ExporterBase::new("json", "application/json"),
        }
    }

    /// Shared extension/mime pair and the cent formatter.
    pub const fn base(&self) -> &ExporterBase {
        &self.base
    }
}

impl Default for JsonExporter {
    fn default() -> Self {
        Self::new()
    }
}

impl ExporterContract for JsonExporter {
    fn extension(&self) -> &'static str {
        self.base.extension
    }

    fn mime(&self) -> &'static str {
        self.base.mime
    }

    fn export(&self, rows: &[ReportRow]) -> String {
        serde_json::to_string(rows).unwrap_or_else(|_| "[]".to_string())
    }
}
