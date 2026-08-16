//! Order lifecycle and pricing, exercised through the public surface.

use atelier_core::concerns::has_reference::HasReference;
use atelier_core::container::Container;
use atelier_core::models::part::Part;
use atelier_core::models::repair_order::RepairOrder;
use atelier_core::money::Money;
use atelier_core::support::priority::Priority;
use atelier_core::support::status::RepairStatus;

fn seeded_order() -> RepairOrder {
    let mut order = RepairOrder::new(1, 1, 1).with_labor(120);
    let part = Part::new(1, "SCR-13", "Screen 13\"", Money(19_900)).with_stock(4);
    order.add_part(&part, 1);

    order
}

#[test]
fn walks_the_happy_path() {
    let mut order = seeded_order();

    assert!(order.transition_to(RepairStatus::Diagnosing, "seeder"));
    assert!(order.transition_to(RepairStatus::Repairing, "seeder"));
    order.complete("seeder").expect("completes");

    assert_eq!(order.status, RepairStatus::Completed);
    assert_eq!(order.log.len(), 3);
}

#[test]
fn refuses_an_illegal_jump() {
    let mut order = seeded_order();

    assert!(!order.transition_to(RepairStatus::Collected, "seeder"));
    assert!(order.complete("seeder").is_err());
}

#[test]
fn standard_binding_leaves_the_subtotal_alone() {
    let order = seeded_order();
    let container = Container::bind_default();

    assert_eq!(order.parts_subtotal(), Money(19_900));
    assert_eq!(order.total(&container), Money(19_900 + 15_000));
}

#[test]
fn rush_binding_applies_the_surcharge() {
    let order = seeded_order().with_priority(Priority::Rush);
    let container = Container::bind_rush();

    assert_eq!(order.total(&container), Money(43_625));
}

#[test]
fn warranty_orders_are_never_surcharged() {
    let order = seeded_order().with_priority(Priority::Warranty);
    let container = Container::bind_rush();

    assert_eq!(order.total(&container), Money(34_900));
}

#[test]
fn trait_default_body_formats_the_reference() {
    let order = seeded_order();

    assert_eq!(order.reference(), "AT-2026-000001");
}
