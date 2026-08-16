//! Invoice issued for a completed order.

use crate::money::Money;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Invoice {
    pub id: u32,
    pub repair_order_id: u32,
    pub total: Money,
    pub paid: bool,
}

impl Invoice {
    pub fn new(id: u32, repair_order_id: u32, total: Money) -> Self {
        Self {
            id,
            repair_order_id,
            total,
            paid: false,
        }
    }

    pub fn mark_paid(&mut self) -> bool {
        if self.paid {
            return false;
        }

        self.paid = true;

        true
    }

    pub fn outstanding(&self) -> Money {
        if self.paid { Money::ZERO } else { self.total }
    }
}
