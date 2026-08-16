//! First hop of a two-level re-export chain: [`crate::lib`] re-exports this
//! module's re-export, not the declaring module directly.

pub use crate::contracts::rule_contract::RuleContract;
