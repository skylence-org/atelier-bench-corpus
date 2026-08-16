//! Repair-atelier domain core.
//!
//! Deliberate navigation edges live here: a same-name type pair
//! ([`billing::Formatter`] vs [`reporting::Formatter`]), a trait with two
//! implementations resolved through a container binding, macro-generated
//! methods, and a set of re-exports that a definition lookup must see through.

pub mod billing;
pub mod concerns;
pub mod container;
pub mod contracts;
pub mod errors;
pub mod events;
pub mod models;
pub mod money;
pub mod observers;
pub mod policy;
pub mod reporting;
pub mod services;
pub mod support;

// Re-export surface: a `definition` request on any of these must land on the
// real declaration in its own module, never on this `pub use` line.
pub use crate::contracts::invoice_calculator::InvoiceCalculator;
pub use crate::errors::AtelierError;
pub use crate::models::customer::Customer;
pub use crate::models::device::Device;
pub use crate::models::part::Part;
pub use crate::models::repair_order::RepairOrder;
pub use crate::models::technician::Technician;
pub use crate::money::Money;
pub use crate::support::helpers::{ATELIER_REF_PREFIX, atelier_format_reference};
pub use crate::support::priority::Priority;
pub use crate::support::status::RepairStatus;

/// Convenience alias used across the app lane; resolution must follow the
/// alias to [`crate::errors::AtelierError`].
pub type Result<T> = std::result::Result<T, AtelierError>;
