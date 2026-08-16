//! Billing-side formatter.
//!
//! Shadow pair: [`crate::reporting::formatter::Formatter`] has the same type
//! name. Call sites alias both, so resolution must follow the alias.

use crate::money::Money;

/// Formats amounts for invoices.
#[derive(Debug, Clone, Default)]
pub struct Formatter {
    currency: String,
}

impl Formatter {
    pub fn new(currency: impl Into<String>) -> Self {
        Self {
            currency: currency.into(),
        }
    }

    /// Render `amount` with the configured currency suffix.
    pub fn money(&self, amount: Money, currency: &str) -> String {
        let currency = if currency.is_empty() {
            self.currency.as_str()
        } else {
            currency
        };

        format!("{amount} {currency}")
    }

    /// Invoice line: quantity, description, extended amount.
    pub fn line(&self, quantity: u32, description: &str, amount: Money) -> String {
        format!("{quantity} x {description} = {}", self.money(amount, ""))
    }
}
