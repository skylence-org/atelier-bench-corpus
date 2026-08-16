//! Rule 23/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct SlotOverbookingRule;

impl RuleContract for SlotOverbookingRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.orders.is_empty()
    }
}
