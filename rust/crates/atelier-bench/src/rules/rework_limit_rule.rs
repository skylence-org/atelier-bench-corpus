//! Rule 11/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct ReworkLimitRule;

impl RuleContract for ReworkLimitRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.orders.is_empty()
    }
}
