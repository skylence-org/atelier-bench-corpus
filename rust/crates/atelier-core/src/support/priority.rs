//! Order priority and its pricing effect.

use serde::{Deserialize, Serialize};

/// Priority tier chosen at intake.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Priority {
    #[default]
    Standard,
    Rush,
    Warranty,
}

impl Priority {
    /// Surcharge in basis points applied to the labour subtotal.
    pub fn surcharge_bp(&self) -> u32 {
        match self {
            Priority::Standard => 0,
            Priority::Rush => 2_500,
            Priority::Warranty => 0,
        }
    }

    pub fn label(&self) -> &'static str {
        match self {
            Priority::Standard => "Standard",
            Priority::Rush => "Rush",
            Priority::Warranty => "Warranty",
        }
    }

    /// Rush work jumps the queue; warranty work does not.
    pub fn is_expedited(&self) -> bool {
        matches!(self, Priority::Rush)
    }

    /// Warranty orders are never invoiced to the customer.
    pub fn is_billable(&self) -> bool {
        !matches!(self, Priority::Warranty)
    }
}
