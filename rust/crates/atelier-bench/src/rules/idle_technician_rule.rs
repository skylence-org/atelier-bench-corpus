//! Rule 24/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct IdleTechnicianRule;

impl RuleContract for IdleTechnicianRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.technicians.is_empty()
    }
}
