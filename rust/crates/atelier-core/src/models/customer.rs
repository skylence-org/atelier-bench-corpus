//! Customer record.

use crate::concerns::has_reference::HasReference;
use serde::{Deserialize, Serialize};

/// Owner of one or more devices.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Customer {
    pub id: u32,
    pub name: String,
    pub email: String,
    pub phone: Option<String>,
    pub reference_number: u32,
}

impl Customer {
    pub fn new(id: u32, name: impl Into<String>, email: impl Into<String>) -> Self {
        Self {
            id,
            name: name.into(),
            email: email.into(),
            phone: None,
            reference_number: id,
        }
    }

    pub fn with_phone(mut self, phone: impl Into<String>) -> Self {
        self.phone = Some(phone.into());
        self
    }

    /// Display name used in tables and the report header.
    pub fn display_name(&self) -> String {
        format!("{} <{}>", self.name, self.email)
    }

    pub fn is_reachable(&self) -> bool {
        self.phone.is_some() || !self.email.is_empty()
    }
}

impl HasReference for Customer {
    const PREFIX: &'static str = "CU";

    fn reference_number(&self) -> u32 {
        self.reference_number
    }
}
