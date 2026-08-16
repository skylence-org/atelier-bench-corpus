//! Polymorphic note attachable to several record kinds.

use serde::{Deserialize, Serialize};

/// What a note can hang off. The Rust analogue of a polymorphic relation.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NotableKind {
    Customer,
    Device,
    RepairOrder,
    Part,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Note {
    pub id: u32,
    pub notable_kind: NotableKind,
    pub notable_id: u32,
    pub body: String,
    pub author: String,
}

impl Note {
    pub fn new(id: u32, kind: NotableKind, notable_id: u32, body: impl Into<String>) -> Self {
        Self {
            id,
            notable_kind: kind,
            notable_id,
            body: body.into(),
            author: "system".to_string(),
        }
    }

    pub fn excerpt(&self, width: usize) -> String {
        if self.body.chars().count() <= width {
            return self.body.clone();
        }

        let head: String = self.body.chars().take(width.saturating_sub(1)).collect();

        format!("{head}\u{2026}")
    }
}
