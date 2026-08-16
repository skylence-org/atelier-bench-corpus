//! Rule 5/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct TechnicianCapacityRule;

impl RuleContract for TechnicianCapacityRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.technicians.is_empty()
    }
}
