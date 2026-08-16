//! Rule 4/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct RushSurchargeRule;

impl RuleContract for RushSurchargeRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.orders.is_empty()
    }
}
