//! SMTP transport.

use crate::contracts::notifier_contract::{Delivery, NotifierContract, NotifyError};
use crate::support::abstract_notifier::NotifierBase;

/// SMTP transport.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EmailNotifier {
    base: NotifierBase,
}

impl EmailNotifier {
    /// Channel name reported on every delivery receipt.
    pub const CHANNEL: &'static str = "email";

    pub fn new(endpoint: impl Into<String>) -> Self {
        Self {
            base: NotifierBase::new(Self::CHANNEL, endpoint),
        }
    }

    /// Shared endpoint state and its validation rules.
    pub fn base(&self) -> &NotifierBase {
        &self.base
    }
}

impl Default for EmailNotifier {
    fn default() -> Self {
        Self::new("smtp://mail.test:25")
    }
}

impl NotifierContract for EmailNotifier {
    fn channel(&self) -> &'static str {
        self.base.channel
    }

    fn max_bytes(&self) -> usize {
        65_536
    }

    fn send(&self, subject: &str, body: &str) -> Result<Delivery, NotifyError> {
        if !self.base.is_configured() {
            return Err(NotifyError::NotConfigured(self.channel()));
        }

        if subject.len() + body.len() > self.max_bytes() {
            return Err(NotifyError::TooLarge(self.channel(), self.max_bytes()));
        }

        Ok(Delivery {
            channel: self.channel(),
            reference: format!("{}:{subject}", self.channel()),
        })
    }
}
