//! Outbound channels.

/// Receipt handed back by a successful send.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Delivery {
    pub channel: &'static str,
    pub reference: String,
}

/// Why a send did not happen.
#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum NotifyError {
    #[error("channel {0} is not configured")]
    NotConfigured(&'static str),

    #[error("payload for channel {0} exceeds {1} bytes")]
    TooLarge(&'static str, usize),
}

/// One outbound transport.
pub trait NotifierContract: Send + Sync {
    fn channel(&self) -> &'static str;

    /// Largest payload this transport accepts.
    fn max_bytes(&self) -> usize {
        4_096
    }

    fn send(&self, subject: &str, body: &str) -> Result<Delivery, NotifyError>;
}
