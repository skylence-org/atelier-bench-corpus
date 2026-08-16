//! Read side over issued invoices.

use atelier_core::contracts::repository::Repository;
use atelier_core::models::invoice::Invoice;

/// Read side over issued invoices.
#[derive(Debug, Clone, Default)]
pub struct InvoiceRepository {
    records: Vec<Invoice>,
}

impl InvoiceRepository {
    pub fn new(records: Vec<Invoice>) -> Self {
        Self { records }
    }

    /// Invoices still carrying a balance.
    pub fn unpaid(&self) -> Vec<&Invoice> {
        self.records
            .iter()
            .filter(|invoice| !invoice.paid)
            .collect()
    }
}

impl Repository for InvoiceRepository {
    type Id = u32;
    type Record = Invoice;

    fn find(&self, id: Self::Id) -> Option<&Self::Record> {
        self.records.iter().find(|record| record.id == id)
    }

    fn all(&self) -> &[Self::Record] {
        &self.records
    }
}
