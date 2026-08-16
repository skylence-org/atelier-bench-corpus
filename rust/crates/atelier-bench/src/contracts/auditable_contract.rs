//! Audit-entry production.

use uuid::Uuid;

/// One recorded action.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AuditEntry {
    pub id: Uuid,
    pub actor: String,
    pub action: String,
}

/// Anything that can stamp an audit entry.
pub trait AuditableContract {
    /// Who is acting, for the entry's actor field.
    fn audit_actor(&self) -> String;

    /// Stamp an entry with a fresh id.
    fn audit(&self, action: &str) -> AuditEntry {
        AuditEntry {
            id: Uuid::new_v4(),
            actor: self.audit_actor(),
            action: action.to_string(),
        }
    }
}
