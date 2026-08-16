//! Stock part.

use crate::money::Money;
use serde::{Deserialize, Serialize};

/// A stocked component consumable by repair orders.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Part {
    pub id: u32,
    pub sku: String,
    pub name: String,
    pub unit_price: Money,
    pub stock: u32,
    pub reorder_level: u32,
    pub consumed: u32,
}

impl Part {
    pub fn new(
        id: u32,
        sku: impl Into<String>,
        name: impl Into<String>,
        unit_price: Money,
    ) -> Self {
        Self {
            id,
            sku: sku.into(),
            name: name.into(),
            unit_price,
            stock: 0,
            reorder_level: 2,
            consumed: 0,
        }
    }

    /// Units consumed by completed orders since the last stock count.
    pub fn consumed_quantity(&self) -> u32 {
        self.consumed
    }

    /// Below the reorder level the part shows up on the shortage report.
    pub fn is_low_stock(&self) -> bool {
        self.stock <= self.reorder_level
    }

    pub fn extended_price(&self, quantity: u32) -> Money {
        self.unit_price * i64::from(quantity)
    }

    pub fn with_stock(mut self, stock: u32) -> Self {
        self.stock = stock;
        self
    }

    pub fn consume(&mut self, quantity: u32) -> bool {
        if quantity > self.stock {
            return false;
        }

        self.stock -= quantity;
        self.consumed += quantity;

        true
    }
}
