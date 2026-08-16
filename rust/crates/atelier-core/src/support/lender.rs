//! Generic associated type (GAT) surface: a lending trait whose associated
//! type carries a lifetime, implemented once for a slice-backed store.

/// Lends out a view tied to the borrow of `self`.
pub trait Lender {
    type Loan<'a>
    where
        Self: 'a;

    fn lend(&self) -> Self::Loan<'_>;
}

/// Owns labels; lends the first one.
#[derive(Debug, Default)]
pub struct LabelStore {
    labels: Vec<String>,
}

impl LabelStore {
    pub fn new(labels: Vec<String>) -> Self {
        Self { labels }
    }
}

impl Lender for LabelStore {
    type Loan<'a> = Option<&'a str>;

    fn lend(&self) -> Self::Loan<'_> {
        self.labels.first().map(String::as_str)
    }
}

/// Call site through the GAT: the loan's type is `Option<&str>` here.
pub fn first_label(store: &LabelStore) -> Option<&str> {
    store.lend()
}
