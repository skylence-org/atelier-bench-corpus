pub mod api;
pub mod errors;
pub mod report;

/// Liveness probe.
pub async fn health() -> &'static str {
    "ok"
}
