//! Implementor of the two-supertrait [`DigestContract`].

use crate::concerns::has_audit::HasAudit;
use crate::concerns::has_metadata::HasMetadata;
use crate::contracts::digest_contract::DigestContract;
use indexmap::IndexMap;

/// Carries its own trail and metadata, so the digest needs no dataset.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct AuditDigest {
    trail: Vec<String>,
    metadata: IndexMap<String, String>,
}

impl AuditDigest {
    pub fn new(actor: &str) -> Self {
        let mut metadata = IndexMap::new();
        metadata.insert("actor".to_string(), actor.to_string());

        Self {
            trail: Vec::new(),
            metadata,
        }
    }

    pub fn record(&mut self, action: impl Into<String>) -> &mut Self {
        self.trail.push(action.into());
        self
    }
}

impl HasAudit for AuditDigest {
    fn audit_trail(&self) -> &[String] {
        &self.trail
    }
}

impl HasMetadata for AuditDigest {
    fn metadata(&self) -> &IndexMap<String, String> {
        &self.metadata
    }
}

/// One trait named here, two more inherited through its supertraits.
impl DigestContract for AuditDigest {}
