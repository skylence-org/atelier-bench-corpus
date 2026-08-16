//! Base shared by all 12 services.

use crate::concerns::has_audit::HasAudit;
use crate::contracts::auditable_contract::AuditableContract;

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct ServiceBase {
    pub name: &'static str,
    trail: Vec<String>,
}

impl ServiceBase {
    pub fn new(name: &'static str) -> Self {
        Self {
            name,
            trail: Vec::new(),
        }
    }

    /// Record one action on this service's trail.
    pub fn record(&mut self, action: impl Into<String>) {
        self.trail.push(action.into());
    }
}

impl HasAudit for ServiceBase {
    fn audit_trail(&self) -> &[String] {
        &self.trail
    }
}

impl AuditableContract for ServiceBase {
    fn audit_actor(&self) -> String {
        self.name.to_string()
    }
}
