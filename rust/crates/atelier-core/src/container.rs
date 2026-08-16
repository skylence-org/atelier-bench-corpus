//! Runtime binding of contracts to implementations.

use crate::contracts::invoice_calculator::InvoiceCalculator;
use crate::services::rush_invoice_calculator::RushInvoiceCalculator;
use crate::services::standard_invoice_calculator::StandardInvoiceCalculator;
use std::sync::Arc;

/// Holds the bound implementation behind a trait object, so a call site sees
/// only the contract and the binding decides the concrete type.
#[derive(Clone)]
pub struct Container {
    invoice_calculator: Arc<dyn InvoiceCalculator>,
}

impl Container {
    /// Default binding: [`StandardInvoiceCalculator`].
    pub fn bind_default() -> Self {
        Self {
            invoice_calculator: Arc::new(StandardInvoiceCalculator::default()),
        }
    }

    /// Rush binding: [`RushInvoiceCalculator`] with the flag enabled.
    pub fn bind_rush() -> Self {
        Self {
            invoice_calculator: Arc::new(RushInvoiceCalculator::enabled()),
        }
    }

    pub fn with_invoice_calculator(calculator: Arc<dyn InvoiceCalculator>) -> Self {
        Self {
            invoice_calculator: calculator,
        }
    }

    /// The bound strategy; call sites see `dyn InvoiceCalculator`, never a
    /// concrete service type.
    pub fn invoice_calculator(&self) -> &dyn InvoiceCalculator {
        self.invoice_calculator.as_ref()
    }
}

impl Default for Container {
    fn default() -> Self {
        Self::bind_default()
    }
}

impl std::fmt::Debug for Container {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("Container")
            .field("invoice_calculator", &self.invoice_calculator.name())
            .finish()
    }
}
