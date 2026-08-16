//! Rule 13/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct DepositRequiredRule;

impl RuleContract for DepositRequiredRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.customers.is_empty()
    }
}
