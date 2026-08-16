//! Intake counting.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Intake counting.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OrderVolumeService {
    base: ServiceBase,
}

impl OrderVolumeService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "order-volume";

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

    /// Total orders taken in.
    pub fn total(&self, data: &Dataset) -> usize {
        data.orders.len()
    }

    /// Orders taken in for one customer.
    pub fn for_customer(&self, data: &Dataset, customer_id: u32) -> usize {
        data.orders_for(customer_id).len()
    }
}

impl Default for OrderVolumeService {
    fn default() -> Self {
        Self::new()
    }
}
