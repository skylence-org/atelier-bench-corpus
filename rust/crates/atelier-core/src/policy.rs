//! Authorisation rules.

use crate::models::repair_order::RepairOrder;
use crate::support::status::RepairStatus;

/// Who is asking.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Actor {
    Customer { id: u32 },
    Technician { id: u32 },
    Manager,
}

/// Gate around [`RepairOrder`] mutations.
#[derive(Debug, Clone, Copy, Default)]
pub struct RepairOrderPolicy;

impl RepairOrderPolicy {
    /// Customers see only their own orders; staff see everything.
    pub fn can_view(&self, actor: Actor, order: &RepairOrder) -> bool {
        match actor {
            Actor::Customer { id } => id == order.customer_id,
            Actor::Technician { .. } | Actor::Manager => true,
        }
    }

    /// Only staff move an order forward, and never past a terminal state.
    pub fn can_transition(&self, actor: Actor, order: &RepairOrder) -> bool {
        if order.status.is_terminal() {
            return false;
        }

        matches!(actor, Actor::Technician { .. } | Actor::Manager)
    }

    /// Collection is signed off by the owning customer or a manager.
    pub fn can_collect(&self, actor: Actor, order: &RepairOrder) -> bool {
        if order.status != RepairStatus::Completed {
            return false;
        }

        match actor {
            Actor::Customer { id } => id == order.customer_id,
            Actor::Manager => true,
            Actor::Technician { .. } => false,
        }
    }
}
