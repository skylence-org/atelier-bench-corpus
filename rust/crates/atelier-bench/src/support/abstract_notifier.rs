//! Base shared by all 8 notifiers.

use crate::concerns::has_validation::{HasValidation, Violation};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct NotifierBase {
    pub channel: &'static str,
    pub endpoint: String,
}

impl NotifierBase {
    pub fn new(channel: &'static str, endpoint: impl Into<String>) -> Self {
        Self {
            channel,
            endpoint: endpoint.into(),
        }
    }

    /// A transport with no endpoint configured is inert but not an error.
    pub fn is_configured(&self) -> bool {
        !self.endpoint.is_empty()
    }
}

impl HasValidation for NotifierBase {
    fn validate(&self) -> Vec<Violation> {
        if self.is_configured() {
            return Vec::new();
        }

        vec![Violation::new("endpoint", "endpoint is empty")]
    }
}
