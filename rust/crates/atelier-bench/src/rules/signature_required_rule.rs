//! Rule 16/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct SignatureRequiredRule;

impl RuleContract for SignatureRequiredRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.customers.is_empty()
    }
}
