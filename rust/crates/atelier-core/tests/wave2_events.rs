//! String-keyed subscription: the literal is the only link between the
//! subscribe site and the dispatch that reaches it.

use atelier_core::events::{Dispatcher, DomainEvent, SendCompletionNotice};
use std::sync::Arc;
use std::sync::atomic::Ordering;

#[test]
fn topic_subscription_matches_on_the_literal() {
    let notice = Arc::new(SendCompletionNotice::default());
    let mut dispatcher = Dispatcher::default();
    dispatcher.on("repair.completed", notice.clone());

    assert_eq!(dispatcher.topic_names(), vec!["repair.completed"]);

    dispatcher.dispatch(&DomainEvent::RepairCompleted {
        order_id: 1,
        reference: "AT-2026-000001".to_string(),
    });

    assert_eq!(notice.sent.load(Ordering::Relaxed), 1);
}

#[test]
fn every_variant_carries_its_own_topic() {
    let completed = DomainEvent::RepairCompleted {
        order_id: 1,
        reference: "AT-2026-000001".to_string(),
    };

    assert_eq!(completed.topic(), "repair.completed");
    assert_eq!(
        DomainEvent::StockDepleted {
            sku: "BAT-55".to_string()
        }
        .topic(),
        "stock.depleted"
    );
}
