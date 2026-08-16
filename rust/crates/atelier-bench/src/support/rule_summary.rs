//! Derive-generated trait impl: the derive attribute line above
//! `RuleSummary` is its `Serialize` implementation site.

use crate::dataset::Dataset;
use crate::rules::RULES;
use serde::Serialize;

/// Snapshot of rule pass/fail counts, serialized for the report API.
#[derive(Serialize)]
pub struct RuleSummary {
    pub passed: usize,
    pub failed: usize,
}

impl RuleSummary {
    pub fn compute(data: &Dataset) -> Self {
        let passed = RULES.iter().filter(|rule| rule.evaluate(data)).count();

        Self {
            passed,
            failed: RULES.len() - passed,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_rule_passes_on_seed() {
        let summary = RuleSummary::compute(&Dataset::seeded());

        assert_eq!(summary.passed, 48);
        assert_eq!(summary.failed, 0);
    }
}
