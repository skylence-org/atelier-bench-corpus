//! Deterministic seed reporting.

use crate::state::AppState;

/// One-line description of the frozen dataset, printed by `seed`.
pub fn summarize(state: &AppState) -> String {
    format!(
        "seeded: {} customer(s), {} order(s), {} part(s), revenue {}c",
        state.data.customers.len(),
        state.data.orders.len(),
        state.data.parts.len(),
        state.data.revenue_cents(),
    )
}

/// Every registered metric against the seed, in registry order.
pub fn metric_lines(state: &AppState) -> Vec<String> {
    atelier_bench::METRICS
        .iter()
        .map(|metric| format!("{} = {}", metric.key(), metric.formatted(&state.data)))
        .collect()
}
