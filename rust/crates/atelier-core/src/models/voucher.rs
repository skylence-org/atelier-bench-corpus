//! Second `HasReference` override, alongside [`crate::models::customer::Customer`].

use crate::concerns::has_reference::HasReference;

/// A returns/exchange voucher; its own prefix distinguishes it from every
/// other reference series.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Voucher {
    pub sequence: u32,
}

impl HasReference for Voucher {
    const PREFIX: &'static str = "VO";

    fn reference_number(&self) -> u32 {
        self.sequence
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn overrides_the_default_prefix() {
        let voucher = Voucher { sequence: 7 };

        assert_eq!(voucher.reference(), "VO-2026-000007");
    }
}
