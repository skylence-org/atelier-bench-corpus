//! Integer-cent money newtype with operator overloads.

use serde::{Deserialize, Serialize};
use std::fmt;
use std::iter::Sum;
use std::ops::{Add, AddAssign, Mul, Sub};
use std::str::FromStr;

/// Amount in integer cents. Never a float: bench ground truth must be exact.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Money(pub i64);

impl Money {
    pub const ZERO: Money = Money(0);

    pub const fn from_cents(cents: i64) -> Self {
        Money(cents)
    }

    pub const fn cents(&self) -> i64 {
        self.0
    }

    /// Apply a basis-point surcharge, rounding half away from zero.
    pub fn with_surcharge_bp(&self, bp: u32) -> Money {
        let extra = (self.0 * i64::from(bp) + 5_000) / 10_000;

        Money(self.0 + extra)
    }

    pub fn is_zero(&self) -> bool {
        self.0 == 0
    }
}

impl Add for Money {
    type Output = Money;

    fn add(self, rhs: Money) -> Money {
        Money(self.0 + rhs.0)
    }
}

impl AddAssign for Money {
    fn add_assign(&mut self, rhs: Money) {
        self.0 += rhs.0;
    }
}

impl Sub for Money {
    type Output = Money;

    fn sub(self, rhs: Money) -> Money {
        Money(self.0 - rhs.0)
    }
}

impl Mul<i64> for Money {
    type Output = Money;

    fn mul(self, rhs: i64) -> Money {
        Money(self.0 * rhs)
    }
}

impl Sum for Money {
    fn sum<I: Iterator<Item = Money>>(iter: I) -> Money {
        iter.fold(Money::ZERO, Money::add)
    }
}

impl fmt::Display for Money {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let sign = if self.0 < 0 { "-" } else { "" };
        let abs = self.0.abs();

        write!(f, "{sign}{}.{:02}", abs / 100, abs % 100)
    }
}

/// Failure modes of `"12.34".parse::<Money>()`.
#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum ParseMoneyError {
    #[error("money string is empty")]
    Empty,
    #[error("money string {0:?} has more than one decimal point")]
    TooManyPoints(String),
    #[error("money string {0:?} carries a non-digit segment")]
    NotANumber(String),
}

impl FromStr for Money {
    type Err = ParseMoneyError;

    fn from_str(raw: &str) -> Result<Self, Self::Err> {
        let trimmed = raw.trim();
        if trimmed.is_empty() {
            return Err(ParseMoneyError::Empty);
        }

        let mut segments = trimmed.split('.');
        let whole = segments.next().unwrap_or_default();
        let fraction = segments.next().unwrap_or("0");
        if segments.next().is_some() {
            return Err(ParseMoneyError::TooManyPoints(trimmed.to_string()));
        }

        let whole: i64 = whole
            .parse()
            .map_err(|_| ParseMoneyError::NotANumber(trimmed.to_string()))?;
        let fraction: i64 = format!("{fraction:0<2}")
            .parse()
            .map_err(|_| ParseMoneyError::NotANumber(trimmed.to_string()))?;

        Ok(Money(whole * 100 + fraction))
    }
}

/// Extension trait: adds a method to a foreign primitive type.
pub trait MoneyExt {
    fn cents(self) -> Money;
}

impl MoneyExt for i64 {
    fn cents(self) -> Money {
        Money(self)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn surcharge_rounds_half_up() {
        assert_eq!(Money(10_000).with_surcharge_bp(2_500), Money(12_500));
    }

    #[test]
    fn parses_and_displays() {
        let parsed: Money = "12.34".parse().expect("parses");
        assert_eq!(parsed, Money(1_234));
        assert_eq!(parsed.to_string(), "12.34");
    }

    #[test]
    fn extension_trait_on_primitive() {
        assert_eq!(1_500_i64.cents(), Money(1_500));
    }
}
