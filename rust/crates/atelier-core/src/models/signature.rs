//! Collection signature: at most one per order.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Signature {
    pub id: u32,
    pub repair_order_id: u32,
    pub signed_by: String,
    pub svg_path: String,
}

impl Signature {
    pub fn new(id: u32, repair_order_id: u32, signed_by: impl Into<String>) -> Self {
        Self {
            id,
            repair_order_id,
            signed_by: signed_by.into(),
            svg_path: String::new(),
        }
    }

    pub fn is_captured(&self) -> bool {
        !self.svg_path.is_empty()
    }
}
