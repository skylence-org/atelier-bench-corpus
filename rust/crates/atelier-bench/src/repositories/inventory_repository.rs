//! Read side over stock movements.

use atelier_core::contracts::repository::Repository;

/// One stock in/out movement.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StockMovement {
    pub id: u32,
    pub sku: String,
    pub delta: i32,
}

/// Read side over stock movements.
#[derive(Debug, Clone, Default)]
pub struct InventoryRepository {
    records: Vec<StockMovement>,
}

impl InventoryRepository {
    pub fn new(records: Vec<StockMovement>) -> Self {
        Self { records }
    }

    /// Net movement for one sku.
    pub fn net_for(&self, sku: &str) -> i32 {
        self.records
            .iter()
            .filter(|movement| movement.sku == sku)
            .map(|movement| movement.delta)
            .sum()
    }
}

impl Repository for InventoryRepository {
    type Id = u32;
    type Record = StockMovement;

    fn find(&self, id: Self::Id) -> Option<&Self::Record> {
        self.records.iter().find(|record| record.id == id)
    }

    fn all(&self) -> &[Self::Record] {
        &self.records
    }
}
