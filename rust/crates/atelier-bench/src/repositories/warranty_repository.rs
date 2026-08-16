//! Read side over warranty claims.

use atelier_core::contracts::repository::Repository;

/// One warranty claim raised against an order.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WarrantyClaim {
    pub id: u32,
    pub repair_order_id: u32,
    pub settled: bool,
}

/// Read side over warranty claims.
#[derive(Debug, Clone, Default)]
pub struct WarrantyRepository {
    records: Vec<WarrantyClaim>,
}

impl WarrantyRepository {
    pub fn new(records: Vec<WarrantyClaim>) -> Self {
        Self { records }
    }

    /// Claims still awaiting a decision.
    pub fn pending(&self) -> Vec<&WarrantyClaim> {
        self.records.iter().filter(|claim| !claim.settled).collect()
    }
}

impl Repository for WarrantyRepository {
    type Id = u32;
    type Record = WarrantyClaim;

    fn find(&self, id: Self::Id) -> Option<&Self::Record> {
        self.records.iter().find(|record| record.id == id)
    }

    fn all(&self) -> &[Self::Record] {
        &self.records
    }
}
