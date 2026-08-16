//! Consumer of the two-level re-export chain: imports `RuleContract` from
//! the bench crate root, two hops from its declaring module
//! (`atelier_bench::contracts::rule_contract` -> `atelier_bench::prelude` ->
//! `atelier_bench`).

use atelier_bench::RuleContract;

pub fn passes(rule: &dyn RuleContract, data: &atelier_bench::Dataset) -> bool {
    rule.evaluate(data)
}
