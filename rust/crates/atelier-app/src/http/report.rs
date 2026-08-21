//! Customer-facing report endpoint.
//!
//! Live call path for the shadow pair: `state.money` and `state.status` are
//! two different `Formatter` types reached through aliases.

use atelier_core::concerns::has_reference::HasReference;
use atelier_core::errors::NotFoundError;
use axum::Json;
use axum::extract::{Path, State};
use serde::Serialize;

use crate::http::errors::ApiError;
use crate::state::AppState;

/// What `GET /report/{reference}` renders.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct ReportView {
    pub reference: String,
    pub customer: String,
    pub device: String,
    pub status: String,
    pub total: String,
    pub calculator: &'static str,
}

/// Look an order up by its formatted reference, then render it.
pub async fn show(
    State(state): State<AppState>,
    Path(reference): Path<String>,
) -> Result<Json<ReportView>, ApiError> {
    let order = state
        .data
        .orders
        .iter()
        .find(|order| order.reference() == reference)
        .ok_or_else(|| NotFoundError::new("repair order", reference.clone()))?;

    let customer = state
        .data
        .customers
        .iter()
        .find(|customer| customer.id == order.customer_id);
    let device = state
        .data
        .devices
        .iter()
        .find(|device| device.id == order.device_id);

    Ok(Json(ReportView {
        reference,
        customer: customer
            .map(|customer| customer.display_name())
            .unwrap_or_default(),
        device: device.map(|device| device.label()).unwrap_or_default(),
        status: state.status.status_line(order.status, Some("intake")),
        total: state.money.money(order.total(&state.container), "EUR"),
        calculator: state.container.invoice_calculator().name(),
    }))
}
