//! Namespace import: the whole `rules` module is bound, one member is read.
//!
//! Binding the module via the namespace import names the MODULE, not an item. Only `rules::RULES` is
//! ever touched here; `rules::rules`, `rules::generated` and the 24 rule
//! submodules stay unreached from this file.

use crate::dataset::Dataset;
use crate::rules;

/// Rules that hold for `data`, counted through the namespace binding.
pub fn passing_rule_count(data: &Dataset) -> usize {
    rules::RULES
        .iter()
        .filter(|rule| rule.evaluate(data))
        .count()
}
