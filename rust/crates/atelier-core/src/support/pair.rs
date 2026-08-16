//! Sibling marker pair: only one of the two is ever imported downstream.

/// Marker: rendered on the left.
pub struct Left;

/// Marker: rendered on the right. Never imported by anything in this lane --
/// the whole point is that only `Left` crosses the import boundary.
pub struct Right;
