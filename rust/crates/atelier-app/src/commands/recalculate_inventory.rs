//! `recalculate`: run the inventory job against the seeded dataset.

use atelier_core::events::{Dispatcher, SendCompletionNotice};
use std::sync::Arc;

use crate::jobs::RecalculateInventory;
use crate::state::AppState;

/// Run the job with the default threshold; returns the announced count.
pub fn run(state: &AppState) -> usize {
    let mut dispatcher = Dispatcher::default();
    dispatcher.register(Arc::new(SendCompletionNotice::default()));

    RecalculateInventory::new(RecalculateInventory::DEFAULT_THRESHOLD).run(&state.data, &dispatcher)
}
