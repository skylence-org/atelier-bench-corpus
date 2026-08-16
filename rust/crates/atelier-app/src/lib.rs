//! Application surface for the rust lane.
//!
//! The router below is the corpus's live call path: it reaches the domain core
//! through a container binding and the breadth subsystem through the report
//! registry, so a request-level test exercises both crates at once.

pub mod commands;
pub mod http;
pub mod jobs;
pub mod seed;
pub mod state;

use axum::Router;
use axum::routing::{get, post};

use crate::state::AppState;

/// Build the whole router. Tests call this directly; `serve` wraps it.
pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(http::health))
        .route("/report/{reference}", get(http::report::show))
        .route("/api/orders", get(http::api::list_orders))
        .route("/api/orders/{id}/notes", post(http::api::store_note))
        .route("/api/reports/{slug}", get(http::api::show_report))
        .with_state(state)
}

/// Bind and serve until the process is stopped.
pub async fn serve(state: AppState, port: u16) -> anyhow::Result<()> {
    let listener = tokio::net::TcpListener::bind(("127.0.0.1", port)).await?;
    tracing::info!(port, "atelier listening");

    axum::serve(listener, router(state)).await?;

    Ok(())
}
