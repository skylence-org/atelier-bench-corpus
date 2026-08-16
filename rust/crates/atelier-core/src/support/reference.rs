//! Reference numbering rules.

/// Carrier for the reference-format associated constants.
///
/// Deliberately a unit struct: the interesting navigation target is the
/// associated const, not the value.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub struct Reference;

impl Reference {
    /// Separator between prefix, year and number segments.
    pub const PREFIX_SEPARATOR: char = '-';

    /// Frozen year segment: the corpus seed must stay deterministic.
    pub const DEFAULT_YEAR: u16 = 2026;

    /// First number handed out by a fresh counter.
    pub const FIRST_NUMBER: u32 = 1;

    /// Next number in sequence, saturating at the u32 ceiling.
    pub fn next(current: u32) -> u32 {
        current.saturating_add(1)
    }
}
