//! Bench utilisation.

use crate::dataset::Dataset;
use crate::support::abstract_service::ServiceBase;

/// Bench utilisation.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TechnicianLoadService {
    base: ServiceBase,
}

impl TechnicianLoadService {
    /// Service name, used as the audit actor.
    pub const NAME: &'static str = "technician-load";

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

    /// Mean booked share across the bench.
    pub fn mean_utilisation(&self, data: &Dataset) -> f64 {
        if data.technicians.is_empty() {
            return 0.0;
        }

        let total: f64 = data.technicians.iter().map(|t| t.utilisation()).sum();

        total / data.technicians.len() as f64
    }
}

impl Default for TechnicianLoadService {
    fn default() -> Self {
        Self::new()
    }
}
