//! Read side over seeded customers.

use atelier_core::Customer;
use atelier_core::contracts::repository::Repository;

/// Read side over seeded customers.
#[derive(Debug, Clone, Default)]
pub struct CustomerRepository {
    records: Vec<Customer>,
}

impl CustomerRepository {
    pub fn new(records: Vec<Customer>) -> Self {
        Self { records }
    }

    /// Customers reachable by phone or email.
    pub fn reachable(&self) -> Vec<&Customer> {
        self.records
            .iter()
            .filter(|customer| customer.is_reachable())
            .collect()
    }
}

impl Repository for CustomerRepository {
    type Id = u32;
    type Record = Customer;

    fn find(&self, id: Self::Id) -> Option<&Self::Record> {
        self.records.iter().find(|record| record.id == id)
    }

    fn all(&self) -> &[Self::Record] {
        &self.records
    }
}
