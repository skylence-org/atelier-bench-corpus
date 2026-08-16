//! Rule 6/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct PartAvailabilityRule;

impl RuleContract for PartAvailabilityRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.parts.is_empty()
    }
}
