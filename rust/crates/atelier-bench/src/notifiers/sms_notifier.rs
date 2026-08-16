//! SMS transport with the classic length cap.

use crate::contracts::notifier_contract::{Delivery, NotifierContract, NotifyError};
use crate::support::abstract_notifier::NotifierBase;

/// SMS transport with the classic length cap.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SmsNotifier {
    base: NotifierBase,
}

impl SmsNotifier {
    /// Channel name reported on every delivery receipt.
    pub const CHANNEL: &'static str = "sms";

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

impl Default for SmsNotifier {
    fn default() -> Self {
        Self::new("https://sms.test/send")
    }
}

impl NotifierContract for SmsNotifier {
    fn channel(&self) -> &'static str {
        self.base.channel
    }

    fn max_bytes(&self) -> usize {
        160
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
