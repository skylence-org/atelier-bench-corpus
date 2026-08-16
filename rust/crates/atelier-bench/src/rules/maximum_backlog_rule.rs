//! Rule 2/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct MaximumBacklogRule;

impl RuleContract for MaximumBacklogRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.open_orders().is_empty()
    }
}
