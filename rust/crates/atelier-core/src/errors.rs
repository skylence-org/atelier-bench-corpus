//! Crate error type and its `?` conversions.

use crate::money::ParseMoneyError;
use crate::support::status::RepairStatus;

/// A lookup that found nothing, kept as its own type so `?` converts it into
/// [`AtelierError`]. Rust has no subclassing: this is the stand-in for the
/// `NotFoundError extends AtelierError` subclass the other lanes carry.
#[derive(Debug, thiserror::Error)]
#[error("no {kind} with reference {reference}")]
pub struct NotFoundError {
    pub kind: &'static str,
    pub reference: String,
}

impl NotFoundError {
    pub fn new(kind: &'static str, reference: impl Into<String>) -> Self {
        Self {
            kind,
            reference: reference.into(),
        }
    }
}

/// Every fallible domain operation funnels through this enum.
#[derive(Debug, thiserror::Error)]
pub enum AtelierError {
    #[error("no repair order with reference {0}")]
    OrderNotFound(String),

    #[error("no part with sku {0}")]
    PartNotFound(String),

    #[error("illegal transition {from} -> {to}")]
    IllegalTransition {
        from: RepairStatus,
        to: RepairStatus,
    },

    #[error("part {sku} is short by {missing} unit(s)")]
    InsufficientStock { sku: String, missing: u32 },

    #[error("malformed money value")]
    Money(#[from] ParseMoneyError),

    #[error("malformed payload")]
    Payload(#[from] serde_json::Error),

    #[error(transparent)]
    NotFound(#[from] NotFoundError),
}

impl AtelierError {
    /// Recoverable errors are surfaced to the customer; the rest are logged.
    pub fn is_client_visible(&self) -> bool {
        matches!(
            self,
            AtelierError::OrderNotFound(_)
                | AtelierError::PartNotFound(_)
                | AtelierError::IllegalTransition { .. }
                | AtelierError::NotFound(_)
        )
    }

    pub fn status_code(&self) -> u16 {
        match self {
            AtelierError::OrderNotFound(_)
            | AtelierError::PartNotFound(_)
            | AtelierError::NotFound(_) => 404,
            AtelierError::IllegalTransition { .. } | AtelierError::InsufficientStock { .. } => 409,
            AtelierError::Money(_) | AtelierError::Payload(_) => 422,
        }
    }
}
