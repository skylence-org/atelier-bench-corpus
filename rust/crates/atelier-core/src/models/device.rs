//! Device brought in for repair.

use serde::{Deserialize, Serialize};

/// A single serviceable unit belonging to a customer.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Device {
    pub id: u32,
    pub customer_id: u32,
    pub brand: String,
    pub model: String,
    pub serial: Option<String>,
}

impl Device {
    pub fn new(
        id: u32,
        customer_id: u32,
        brand: impl Into<String>,
        model: impl Into<String>,
    ) -> Self {
        Self {
            id,
            customer_id,
            brand: brand.into(),
            model: model.into(),
            serial: None,
        }
    }

    /// Human label such as `Framework 13 (SER-9)`.
    pub fn label(&self) -> String {
        match &self.serial {
            Some(serial) => format!("{} {} ({serial})", self.brand, self.model),
            None => format!("{} {}", self.brand, self.model),
        }
    }

    pub fn with_serial(mut self, serial: impl Into<String>) -> Self {
        self.serial = Some(serial.into());
        self
    }

    /// Devices without a serial cannot be warranty-claimed.
    pub fn is_warranty_eligible(&self) -> bool {
        self.serial.is_some()
    }
}
