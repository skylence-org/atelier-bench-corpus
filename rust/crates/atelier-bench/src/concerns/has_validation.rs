//! Field-level validation.

/// One failed rule.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Violation {
    pub field: &'static str,
    pub message: String,
}

impl Violation {
    pub fn new(field: &'static str, message: impl Into<String>) -> Self {
        Self {
            field,
            message: message.into(),
        }
    }
}

pub trait HasValidation {
    /// Every rule that currently fails.
    fn validate(&self) -> Vec<Violation>;

    fn is_valid(&self) -> bool {
        self.validate().is_empty()
    }

    fn first_violation(&self) -> Option<Violation> {
        self.validate().into_iter().next()
    }
}
