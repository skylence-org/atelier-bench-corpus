//! Read side over the bench roster.

use atelier_core::Technician;
use atelier_core::contracts::repository::Repository;

/// Read side over the bench roster.
#[derive(Debug, Clone, Default)]
pub struct TechnicianRepository {
    records: Vec<Technician>,
}

impl TechnicianRepository {
    pub fn new(records: Vec<Technician>) -> Self {
        Self { records }
    }

    /// Technicians with head-room left today.
    pub fn available(&self) -> Vec<&Technician> {
        self.records
            .iter()
            .filter(|technician| technician.next_slot().is_some())
            .collect()
    }
}

impl Repository for TechnicianRepository {
    type Id = u32;
    type Record = Technician;

    fn find(&self, id: Self::Id) -> Option<&Self::Record> {
        self.records.iter().find(|record| record.id == id)
    }

    fn all(&self) -> &[Self::Record] {
        &self.records
    }
}
