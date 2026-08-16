//! Many-to-many label attachable to several record kinds.

use crate::models::note::NotableKind;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Label {
    pub id: u32,
    pub name: String,
    pub colour: String,
}

/// Join row: the Rust analogue of a polymorphic pivot table.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Labelable {
    pub label_id: u32,
    pub kind: NotableKind,
    pub record_id: u32,
}

impl Label {
    pub fn new(id: u32, name: impl Into<String>) -> Self {
        Self {
            id,
            name: name.into(),
            colour: "slate".to_string(),
        }
    }

    /// Records of `kind` carrying this label.
    pub fn attached_ids(&self, joins: &[Labelable], kind: NotableKind) -> Vec<u32> {
        joins
            .iter()
            .filter(|join| join.label_id == self.id && join.kind == kind)
            .map(|join| join.record_id)
            .collect()
    }
}
