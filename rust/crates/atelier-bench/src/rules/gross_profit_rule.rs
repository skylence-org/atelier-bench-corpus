//! Rule 21/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct GrossProfitRule;

impl RuleContract for GrossProfitRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        data.revenue_cents() > 0
    }
}
