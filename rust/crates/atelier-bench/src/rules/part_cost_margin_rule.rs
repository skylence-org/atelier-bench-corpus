//! Rule 19/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct PartCostMarginRule;

impl RuleContract for PartCostMarginRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        data.parts_cost_cents() >= 0
    }
}
