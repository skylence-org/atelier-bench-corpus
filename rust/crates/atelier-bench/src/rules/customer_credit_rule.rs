//! Rule 8/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct CustomerCreditRule;

impl RuleContract for CustomerCreditRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.customers.is_empty()
    }
}
