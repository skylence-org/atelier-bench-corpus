//! Domain events and their listeners.

use crate::support::status::RepairStatus;

/// Topic string a listener subscribes to. Nothing declares it as a symbol at
/// the subscribe site: the literal is the whole connection.
pub const REPAIR_COMPLETED: &str = "repair.completed";

/// Anything the app broadcasts after a state change.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DomainEvent {
    RepairCompleted {
        order_id: u32,
        reference: String,
    },
    StatusChanged {
        order_id: u32,
        from: RepairStatus,
        to: RepairStatus,
    },
    StockDepleted {
        sku: String,
    },
}

impl DomainEvent {
    /// Channel name a broadcast driver would publish on.
    pub fn channel(&self) -> String {
        match self {
            DomainEvent::RepairCompleted { order_id, .. } => format!("orders.{order_id}"),
            DomainEvent::StatusChanged { order_id, .. } => format!("orders.{order_id}"),
            DomainEvent::StockDepleted { .. } => "inventory".to_string(),
        }
    }

    pub fn is_customer_facing(&self) -> bool {
        matches!(self, DomainEvent::RepairCompleted { .. })
    }

    /// Topic key, written as a literal in every arm, so a name-based search is
    /// the only way to connect an event to the subscribers it reaches.
    pub fn topic(&self) -> &'static str {
        match self {
            DomainEvent::RepairCompleted { .. } => "repair.completed",
            DomainEvent::StatusChanged { .. } => "status.changed",
            DomainEvent::StockDepleted { .. } => "stock.depleted",
        }
    }
}

/// Handler contract; implementors are registered in a dispatcher.
pub trait Listener: Send + Sync {
    fn handle(&self, event: &DomainEvent);

    fn name(&self) -> &'static str;
}

/// Sends the "your device is ready" notice.
#[derive(Debug, Default)]
pub struct SendCompletionNotice {
    pub sent: std::sync::atomic::AtomicUsize,
}

impl Listener for SendCompletionNotice {
    fn handle(&self, event: &DomainEvent) {
        if let DomainEvent::RepairCompleted { .. } = event {
            self.sent.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
        }
    }

    fn name(&self) -> &'static str {
        "send-completion-notice"
    }
}

/// Fan-out point: every registered listener sees every event.
#[derive(Default)]
pub struct Dispatcher {
    listeners: Vec<std::sync::Arc<dyn Listener>>,
    topic_listeners: Vec<(&'static str, std::sync::Arc<dyn Listener>)>,
}

impl Dispatcher {
    pub fn register(&mut self, listener: std::sync::Arc<dyn Listener>) {
        self.listeners.push(listener);
    }

    pub fn dispatch(&self, event: &DomainEvent) {
        for listener in &self.listeners {
            listener.handle(event);
        }

        for (topic, listener) in &self.topic_listeners {
            if *topic == event.topic() {
                listener.handle(event);
            }
        }
    }

    /// Subscribe by topic string. The match is on the literal, not on a type,
    /// so nothing but the string connects this to the dispatch that reaches it.
    pub fn on(&mut self, topic: &'static str, listener: std::sync::Arc<dyn Listener>) {
        self.topic_listeners.push((topic, listener));
    }

    pub fn topic_names(&self) -> Vec<&'static str> {
        self.topic_listeners.iter().map(|(topic, _)| *topic).collect()
    }

    pub fn listener_names(&self) -> Vec<&'static str> {
        self.listeners.iter().map(|l| l.name()).collect()
    }
}
