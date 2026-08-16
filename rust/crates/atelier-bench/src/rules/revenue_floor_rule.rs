//! Rule 20/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct RevenueFloorRule;

impl RuleContract for RevenueFloorRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        data.revenue_cents() >= 0
    }
}
