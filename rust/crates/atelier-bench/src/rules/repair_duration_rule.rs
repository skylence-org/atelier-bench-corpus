//! Rule 10/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct RepairDurationRule;

impl RuleContract for RepairDurationRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        data.labour_minutes() > 0
    }
}
