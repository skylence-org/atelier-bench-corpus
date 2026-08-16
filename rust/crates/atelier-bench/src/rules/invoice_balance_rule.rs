//! Rule 7/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct InvoiceBalanceRule;

impl RuleContract for InvoiceBalanceRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.invoices.is_empty()
    }
}
