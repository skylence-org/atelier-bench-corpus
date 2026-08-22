//! Hand-written iterator and the namespace-bound rule registry.

use atelier_bench::dataset::Dataset;
use atelier_bench::support::rule_namespace_user::passing_rule_count;

#[test]
fn open_orders_iterator_yields_only_open_orders() {
    let data = Dataset::seeded();
    let yielded: Vec<u32> = data.iter_open_orders().map(|order| order.id).collect();

    assert_eq!(yielded, vec![2, 3, 4]);
    assert_eq!(data.open_labour_minutes(), 165);
}

#[test]
fn namespace_binding_reads_the_rule_registry() {
    let data = Dataset::seeded();

    assert!(passing_rule_count(&data) <= 48);
}
