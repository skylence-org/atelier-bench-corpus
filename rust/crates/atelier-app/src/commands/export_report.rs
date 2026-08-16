//! `report <slug>`: render one registered report as CSV.

use atelier_bench::contracts::exporter_contract::ExporterContract;
use atelier_bench::exporters::csv_exporter::CsvExporter;

use crate::state::AppState;

/// Render `slug` as CSV, or explain that it is not registered.
pub fn run(state: &AppState, slug: &str) -> anyhow::Result<String> {
    let report =
        atelier_bench::report(slug).ok_or_else(|| anyhow::anyhow!("unknown report {slug}"))?;

    Ok(CsvExporter::new().export(&report.rows(&state.data)))
}
