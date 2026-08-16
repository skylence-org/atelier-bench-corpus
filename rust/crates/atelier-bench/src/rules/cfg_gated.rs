//! `#[cfg(test)]`-gated and feature-gated (default off) `RuleContract`
//! implementors: neither ships in a normal build.

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

/// Only compiled with `--features extra-rules`, off by default.
#[cfg(feature = "extra-rules")]
pub struct ExperimentalRule;

#[cfg(feature = "extra-rules")]
impl RuleContract for ExperimentalRule {
    fn evaluate(&self, _data: &Dataset) -> bool {
        true
    }
}

#[cfg(test)]
struct AlwaysTrueRule;

#[cfg(test)]
impl RuleContract for AlwaysTrueRule {
    fn evaluate(&self, _data: &Dataset) -> bool {
        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn always_true_rule_passes() {
        assert!(AlwaysTrueRule.evaluate(&Dataset::seeded()));
    }
}
