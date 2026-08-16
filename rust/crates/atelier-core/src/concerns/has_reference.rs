//! Shared reference behaviour, implemented by two models.

use crate::support::helpers::{ATELIER_REF_PREFIX, atelier_format_reference};

/// Types carrying a human-facing reference string.
///
/// The default body is the shared behaviour a `references` request on this
/// trait must find in both implementors.
pub trait HasReference {
    /// Per-implementor prefix; defaults to the crate-wide constant.
    const PREFIX: &'static str = ATELIER_REF_PREFIX;

    /// Monotonic number behind this record's reference.
    fn reference_number(&self) -> u32;

    /// Formatted reference such as `AT-2026-000123`.
    fn reference(&self) -> String {
        atelier_format_reference(Self::PREFIX, self.reference_number())
    }

    /// Short form used in table cells: prefix plus number, no year.
    fn short_reference(&self) -> String {
        format!("{}{}", Self::PREFIX, self.reference_number())
    }
}
