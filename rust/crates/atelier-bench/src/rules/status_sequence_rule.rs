//! Rule 18/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct StatusSequenceRule;

impl RuleContract for StatusSequenceRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.completed_orders().is_empty()
    }
}
