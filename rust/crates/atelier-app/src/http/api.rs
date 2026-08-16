//! JSON API.

use atelier_bench::contracts::report_contract::ReportRow;
use atelier_core::concerns::has_reference::HasReference;
use axum::Json;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};

use crate::http::errors::ApiError;
use crate::state::AppState;

/// One row of `GET /api/orders`.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct OrderSummary {
    pub id: u32,
    pub reference: String,
    pub status: &'static str,
    pub priority: &'static str,
    pub open: bool,
}

/// Request body of `POST /api/orders/{id}/notes`.
#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
pub struct StoreNote {
    pub body: String,

    #[serde(default)]
    pub author: Option<String>,
}

/// What a stored note echoes back.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct NoteView {
    pub order_id: u32,
    pub body: String,
    pub author: String,
}

/// Every order, newest id last.
pub async fn list_orders(State(state): State<AppState>) -> Json<Vec<OrderSummary>> {
    let rows = state
        .data
        .orders
        .iter()
        .map(|order| OrderSummary {
            id: order.id,
            reference: order.reference(),
            status: order.status.slug(),
            priority: order.priority.label(),
            open: order.is_open(),
        })
        .collect();

    Json(rows)
}

/// Attach a note to an order, rejecting an empty body.
pub async fn store_note(
    State(state): State<AppState>,
    Path(id): Path<u32>,
    Json(payload): Json<StoreNote>,
) -> Result<(StatusCode, Json<NoteView>), ApiError> {
    if payload.body.trim().is_empty() {
        return Err(ApiError::validation("body", "note body must not be empty"));
    }

    let order = state
        .data
        .orders
        .iter()
        .find(|order| order.id == id)
        .ok_or_else(|| atelier_core::errors::AtelierError::OrderNotFound(id.to_string()))?;

    Ok((
        StatusCode::CREATED,
        Json(NoteView {
            order_id: order.id,
            body: payload.body,
            author: payload.author.unwrap_or_else(|| "counter".to_string()),
        }),
    ))
}

/// Render one registered report by slug.
pub async fn show_report(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> Result<Json<Vec<ReportRow>>, ApiError> {
    let report = atelier_bench::report(&slug)
        .ok_or_else(|| ApiError::validation("slug", format!("unknown report {slug}")))?;

    Ok(Json(report.rows(&state.data)))
}
