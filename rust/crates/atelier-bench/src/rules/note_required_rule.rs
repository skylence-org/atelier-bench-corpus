//! Rule 15/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct NoteRequiredRule;

impl RuleContract for NoteRequiredRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.orders.is_empty()
    }
}
