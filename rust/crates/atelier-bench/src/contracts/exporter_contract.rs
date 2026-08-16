//! Serialisation targets for rendered rows.

use crate::contracts::report_contract::ReportRow;

/// Turns rows into a byte-stream body.
pub trait ExporterContract: Send + Sync {
    fn extension(&self) -> &'static str;

    fn mime(&self) -> &'static str;

    /// Render `rows` in this exporter's format.
    fn export(&self, rows: &[ReportRow]) -> String;

    /// Download filename for a report slug.
    fn filename(&self, slug: &str) -> String {
        format!("{slug}.{}", self.extension())
    }
}
