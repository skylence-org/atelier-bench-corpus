//! Read side over recorded payments.

use atelier_core::contracts::repository::Repository;

/// One settled payment against an invoice.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Payment {
    pub id: u32,
    pub invoice_id: u32,
    pub cents: i64,
}

/// Read side over recorded payments.
#[derive(Debug, Clone, Default)]
pub struct PaymentRepository {
    records: Vec<Payment>,
}

impl PaymentRepository {
    pub fn new(records: Vec<Payment>) -> Self {
        Self { records }
    }

    /// Total settled amount in cents.
    pub fn settled_cents(&self) -> i64 {
        self.records.iter().map(|payment| payment.cents).sum()
    }
}

impl Repository for PaymentRepository {
    type Id = u32;
    type Record = Payment;

    fn find(&self, id: Self::Id) -> Option<&Self::Record> {
        self.records.iter().find(|record| record.id == id)
    }

    fn all(&self) -> &[Self::Record] {
        &self.records
    }
}
