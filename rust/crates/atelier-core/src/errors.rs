//! Crate error type and its `?` conversions.

use crate::money::ParseMoneyError;
use crate::support::status::RepairStatus;

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
}

impl AtelierError {
    /// Recoverable errors are surfaced to the customer; the rest are logged.
    pub fn is_client_visible(&self) -> bool {
        matches!(
            self,
            AtelierError::OrderNotFound(_)
                | AtelierError::PartNotFound(_)
                | AtelierError::IllegalTransition { .. }
        )
    }

    pub fn status_code(&self) -> u16 {
        match self {
            AtelierError::OrderNotFound(_) | AtelierError::PartNotFound(_) => 404,
            AtelierError::IllegalTransition { .. } | AtelierError::InsufficientStock { .. } => 409,
            AtelierError::Money(_) | AtelierError::Payload(_) => 422,
        }
    }
}
