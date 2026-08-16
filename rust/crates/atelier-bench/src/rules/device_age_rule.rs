//! Rule 9/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct DeviceAgeRule;

impl RuleContract for DeviceAgeRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.devices.is_empty()
    }
}
