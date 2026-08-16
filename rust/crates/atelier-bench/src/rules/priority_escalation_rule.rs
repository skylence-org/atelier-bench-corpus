//! Rule 17/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct PriorityEscalationRule;

impl RuleContract for PriorityEscalationRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.orders.is_empty()
    }
}
