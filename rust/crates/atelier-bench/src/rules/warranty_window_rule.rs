//! Rule 3/24 (textual half).

use crate::contracts::rule_contract::RuleContract;
use crate::dataset::Dataset;

pub struct WarrantyWindowRule;

impl RuleContract for WarrantyWindowRule {
    fn evaluate(&self, data: &Dataset) -> bool {
        !data.devices.is_empty()
    }
}
