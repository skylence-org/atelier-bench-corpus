//! Promoted trait method and the module-level prefix alias.

use atelier_core::concerns::has_reference::{DEFAULT_REFERENCE_PREFIX, HasReference};
use atelier_core::models::customer::Customer;

#[test]
fn short_reference_is_promoted_from_the_trait() {
    let customer = Customer::new(7, "Ada Byron", "ada@example.test");

    assert_eq!(customer.short_reference(), "CU7");
}

#[test]
fn module_alias_carries_the_crate_prefix() {
    assert_eq!(DEFAULT_REFERENCE_PREFIX, "AT");
}

