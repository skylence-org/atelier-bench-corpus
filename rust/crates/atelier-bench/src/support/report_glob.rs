//! Glob-imports the report contract module: this file never names
//! `ReportContract` or `ReportRow` on its own `use` line, only through `*`.

use crate::contracts::report_contract::*;
use crate::dataset::Dataset;

/// Rows for any report, resolved entirely through the glob import above.
pub fn rows_for(report: &dyn ReportContract, data: &Dataset) -> Vec<ReportRow> {
    report.rows(data)
}
