//! Module file at a NON-standard location: `support/mod.rs` declares it as
//! `#[path = "pathed/tally_sheet.rs"] pub mod ledger;`, so the module is
//! `support::ledger` while the file is `tally_sheet.rs` in a `pathed/` folder.

/// Number of ledger lines the seeded atelier books per day.
pub fn ledger_lines() -> usize {
    12
}

/// A ledger entry keyed by day.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct LedgerLine {
    pub day: u8,
    pub cents: i64,
}
