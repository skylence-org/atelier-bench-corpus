//! Wide contract: 48 concrete implementors (see [`crate::rules`]) plus a
//! blanket impl over `Vec<T>` so a batch of rules is itself a rule.

use crate::dataset::Dataset;

/// Boolean check evaluated against a [`Dataset`].
pub trait RuleContract: Send + Sync {
    fn evaluate(&self, data: &Dataset) -> bool;
}

/// Blanket impl for a foreign generic: every rule in the `Vec` must pass.
impl<T: RuleContract> RuleContract for Vec<T> {
    fn evaluate(&self, data: &Dataset) -> bool {
        self.iter().all(|rule| rule.evaluate(data))
    }
}
