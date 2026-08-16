//! Free functions and crate-level constants.

use crate::support::reference::Reference;

/// Prefix stamped on every human-facing atelier reference.
pub const ATELIER_REF_PREFIX: &str = "AT";

/// Zero-padded width of the numeric segment of a reference.
pub const ATELIER_REF_WIDTH: usize = 6;

/// Build a human-facing reference such as `AT-2026-000123`.
///
/// The numeric segment is zero-padded width [`ATELIER_REF_WIDTH`]; the
/// separator comes from the associated const [`Reference::PREFIX_SEPARATOR`].
pub fn atelier_format_reference(prefix: &str, number: u32) -> String {
    let sep = Reference::PREFIX_SEPARATOR;
    format!(
        "{prefix}{sep}{year}{sep}{number:0width$}",
        year = Reference::DEFAULT_YEAR,
        width = ATELIER_REF_WIDTH,
    )
}

/// Split a formatted reference back into (prefix, year, number).
pub fn atelier_parse_reference(reference: &str) -> Option<(String, u16, u32)> {
    let mut parts = reference.split(Reference::PREFIX_SEPARATOR);
    let prefix = parts.next()?.to_string();
    let year = parts.next()?.parse::<u16>().ok()?;
    let number = parts.next()?.parse::<u32>().ok()?;

    Some((prefix, year, number))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn formats_zero_padded_reference() {
        assert_eq!(
            atelier_format_reference(ATELIER_REF_PREFIX, 123),
            "AT-2026-000123"
        );
    }

    #[test]
    fn round_trips_through_parse() {
        let formatted = atelier_format_reference(ATELIER_REF_PREFIX, 7);
        assert_eq!(
            atelier_parse_reference(&formatted),
            Some(("AT".to_string(), 2026, 7))
        );
    }
}
