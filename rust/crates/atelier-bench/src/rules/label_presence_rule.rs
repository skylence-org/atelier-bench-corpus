//! Rule 14/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct LabelPresenceRule;

impl RuleContract for LabelPresenceRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.devices.is_empty()
    }
}
