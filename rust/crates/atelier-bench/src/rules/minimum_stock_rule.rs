//! Rule 1/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct MinimumStockRule;

impl RuleContract for MinimumStockRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.parts.is_empty()
    }
}
