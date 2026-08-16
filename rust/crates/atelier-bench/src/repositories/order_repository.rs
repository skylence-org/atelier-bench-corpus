//! Read side over repair orders.

use atelier_core::contracts::repository::Repository;
use atelier_core::models::repair_order::RepairOrder;

/// Read side over repair orders.
#[derive(Debug, Clone, Default)]
pub struct OrderRepository {
    records: Vec<RepairOrder>,
}

impl OrderRepository {
    pub fn new(records: Vec<RepairOrder>) -> Self {
        Self { records }
    }

    /// Orders still occupying bench space.
    pub fn open(&self) -> Vec<&RepairOrder> {
        self.records
            .iter()
            .filter(|order| order.is_open())
            .collect()
    }
}

impl Repository for OrderRepository {
    type Id = u32;
    type Record = RepairOrder;

    fn find(&self, id: Self::Id) -> Option<&Self::Record> {
        self.records.iter().find(|record| record.id == id)
    }

    fn all(&self) -> &[Self::Record] {
        &self.records
    }
}
