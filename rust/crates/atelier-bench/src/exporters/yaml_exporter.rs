//! Block sequence, two keys per entry.

use crate::contracts::exporter_contract::ExporterContract;
use crate::contracts::report_contract::ReportRow;
use crate::support::abstract_exporter::ExporterBase;

/// Block sequence, two keys per entry.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct YamlExporter {
    base: ExporterBase,
}

impl YamlExporter {
    pub const fn new() -> Self {
        Self {
            base: ExporterBase::new("yaml", "application/yaml"),
        }
    }

    /// Shared extension/mime pair and the cent formatter.
    pub const fn base(&self) -> &ExporterBase {
        &self.base
    }
}

impl Default for YamlExporter {
    fn default() -> Self {
        Self::new()
    }
}

impl ExporterContract for YamlExporter {
    fn extension(&self) -> &'static str {
        self.base.extension
    }

    fn mime(&self) -> &'static str {
        self.base.mime
    }

    fn export(&self, rows: &[ReportRow]) -> String {
        rows.iter()
            .map(|row| format!("- label: {}\n  cents: {}", row.label, row.cents))
            .collect::<Vec<_>>()
            .join("\n")
    }
}
