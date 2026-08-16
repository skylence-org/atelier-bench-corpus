//! Rule 22/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct ScheduleGapRule;

impl RuleContract for ScheduleGapRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.technicians.is_empty()
    }
}
