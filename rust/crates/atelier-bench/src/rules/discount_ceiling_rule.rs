//! Rule 12/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct DiscountCeilingRule;

impl RuleContract for DiscountCeilingRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.invoices.is_empty()
    }
}
