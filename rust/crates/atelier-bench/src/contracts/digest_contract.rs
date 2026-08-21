//! Two-way supertrait fan-in: one named trait, two parents behind it.
//!
//! `impl DigestContract for AuditDigest {}` names exactly one trait; the
//! implementor also gains [`HasAudit`] and [`HasMetadata`], which that impl
//! line never mentions.

use crate::concerns::has_audit::HasAudit;
use crate::concerns::has_metadata::HasMetadata;

/// One-line digest of a component's metadata width and audit depth.
pub trait DigestContract: HasAudit + HasMetadata {
    /// `<metadata key count>/<audit depth>`, overridable per implementor.
    fn digest(&self) -> String {
        format!("{}/{}", self.meta_keys().len(), self.audit_depth())
    }
}
