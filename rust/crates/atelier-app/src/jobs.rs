//! Background work.

use atelier_bench::dataset::Dataset;
use atelier_core::events::{Dispatcher, DomainEvent};

/// Recount consumed parts and announce anything that ran dry.
#[derive(Debug, Clone, Copy, Default)]
pub struct RecalculateInventory {
    /// Stock at or below this level counts as depleted.
    pub threshold: u32,
}

impl RecalculateInventory {
    pub const DEFAULT_THRESHOLD: u32 = 1;

    pub fn new(threshold: u32) -> Self {
        Self { threshold }
    }

    /// Returns how many parts were announced as depleted.
    pub fn run(&self, data: &Dataset, dispatcher: &Dispatcher) -> usize {
        let mut announced = 0;

        for part in &data.parts {
            if part.stock > self.threshold {
                continue;
            }

            dispatcher.dispatch(&DomainEvent::StockDepleted {
                sku: part.sku.clone(),
            });
            announced += 1;
        }

        announced
    }

    /// Callback style: the continuation is a parameter, so the caller reads
    /// the count from `done` instead of from a return value.
    pub fn run_with_callback(
        &self,
        data: &Dataset,
        dispatcher: &Dispatcher,
        done: impl FnOnce(usize),
    ) {
        done(self.run(data, dispatcher));
    }
}
