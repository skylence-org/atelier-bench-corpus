//! Shared request state.
//!
//! Both halves of the same-name `Formatter` pair are held here under aliases:
//! `money` is [`atelier_core::billing::Formatter`], `status` is
//! [`atelier_core::reporting::Formatter`].

use atelier_bench::dataset::Dataset;
use atelier_core::billing::Formatter as MoneyFormatter;
use atelier_core::container::Container;
use atelier_core::reporting::Formatter as StatusFormatter;
use std::sync::Arc;

/// Everything a handler needs, cloned per request.
#[derive(Clone)]
pub struct AppState {
    pub container: Container,
    pub data: Arc<Dataset>,
    pub money: MoneyFormatter,
    pub status: StatusFormatter,
}

impl AppState {
    /// Default binding plus the frozen dataset.
    pub fn seeded() -> Self {
        Self {
            container: Container::bind_default(),
            data: Arc::new(Dataset::seeded()),
            money: MoneyFormatter::new("EUR"),
            status: StatusFormatter::new("en"),
        }
    }

    /// Same dataset, rush binding: the surcharge path becomes reachable.
    pub fn seeded_rush() -> Self {
        Self {
            container: Container::bind_rush(),
            ..Self::seeded()
        }
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::seeded()
    }
}
