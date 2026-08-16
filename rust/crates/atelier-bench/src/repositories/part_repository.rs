//! Read side over the parts catalogue.

use atelier_core::Part;
use atelier_core::contracts::repository::Repository;

/// Read side over the parts catalogue.
#[derive(Debug, Clone, Default)]
pub struct PartRepository {
    records: Vec<Part>,
}

impl PartRepository {
    pub fn new(records: Vec<Part>) -> Self {
        Self { records }
    }

    /// Catalogue lookup by stock-keeping unit.
    pub fn by_sku(&self, sku: &str) -> Option<&Part> {
        self.records.iter().find(|part| part.sku == sku)
    }
}

impl Repository for PartRepository {
    type Id = u32;
    type Record = Part;

    fn find(&self, id: Self::Id) -> Option<&Self::Record> {
        self.records.iter().find(|record| record.id == id)
    }

    fn all(&self) -> &[Self::Record] {
        &self.records
    }
}
