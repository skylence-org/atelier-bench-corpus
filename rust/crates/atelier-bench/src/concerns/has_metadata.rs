//! Ordered key/value metadata.

use indexmap::IndexMap;

pub trait HasMetadata {
    fn metadata(&self) -> &IndexMap<String, String>;

    fn meta(&self, key: &str) -> Option<&str> {
        self.metadata().get(key).map(String::as_str)
    }

    fn meta_keys(&self) -> Vec<&str> {
        self.metadata().keys().map(String::as_str).collect()
    }
}

/// Insertion-ordered bag, so metadata rendering is deterministic.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct MetadataBag {
    entries: IndexMap<String, String>,
}

impl MetadataBag {
    pub fn set(&mut self, key: impl Into<String>, value: impl Into<String>) -> &mut Self {
        self.entries.insert(key.into(), value.into());
        self
    }
}

impl HasMetadata for MetadataBag {
    fn metadata(&self) -> &IndexMap<String, String> {
        &self.entries
    }
}
