//! Consumes exactly one of the two sibling markers in [`crate::support::pair`].

use crate::support::pair::Left;

/// This report section always renders in the left column.
pub fn left_marker() -> Left {
    Left
}
