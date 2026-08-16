//! Settlement lag.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Settlement lag.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PaymentLatencyService {
    base: ServiceBase,
}

impl PaymentLatencyService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "payment-latency";

    pub fn new() -> Self {
        Self {
            base: ServiceBase::new(Self::NAME),
        }
    }

    /// Shared audit trail.
    pub fn base(&self) -> &ServiceBase {
        &self.base
    }

    /// Mutable access so callers can record their own actions.
    pub fn base_mut(&mut self) -> &mut ServiceBase {
        &mut self.base
    }

    /// Nominal days of lag on the unsettled pile.
    pub fn days(&self, data: &Dataset) -> f64 {
        data.invoices.iter().filter(|invoice| !invoice.paid).count() as f64 * 3.5
    }
}

impl Default for PaymentLatencyService {
    fn default() -> Self {
        Self::new()
    }
}
