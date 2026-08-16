//! HTTP error mapping.

use atelier_core::errors::AtelierError;
use axum::Json;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde_json::json;

/// Everything a handler can fail with.
#[derive(Debug)]
pub enum ApiError {
    /// A domain rule said no.
    Domain(AtelierError),

    /// The request itself was malformed.
    Validation {
        field: &'static str,
        message: String,
    },
}

impl ApiError {
    pub fn validation(field: &'static str, message: impl Into<String>) -> Self {
        ApiError::Validation {
            field,
            message: message.into(),
        }
    }

    /// Status code carried back to the client.
    pub fn status(&self) -> StatusCode {
        match self {
            ApiError::Domain(error) => StatusCode::from_u16(error.status_code())
                .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
            ApiError::Validation { .. } => StatusCode::UNPROCESSABLE_ENTITY,
        }
    }
}

impl From<AtelierError> for ApiError {
    fn from(error: AtelierError) -> Self {
        ApiError::Domain(error)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let status = self.status();
        let body = match &self {
            ApiError::Domain(error) => json!({ "error": error.to_string() }),
            ApiError::Validation { field, message } => {
                json!({ "error": message, "field": field })
            }
        };

        (status, Json(body)).into_response()
    }
}
