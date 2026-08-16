//! Append-only audit trail access.

pub trait HasAudit {
    fn audit_trail(&self) -> &[String];

    fn last_audit(&self) -> Option<&str> {
        self.audit_trail().last().map(String::as_str)
    }

    fn audit_depth(&self) -> usize {
        self.audit_trail().len()
    }
}
