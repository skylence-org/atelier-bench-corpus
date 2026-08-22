//! Callback-style job, and the two same-named `run` functions.

use atelier_app::jobs::RecalculateInventory;
use atelier_app::state::AppState;
use atelier_core::events::{Dispatcher, SendCompletionNotice};
use std::sync::Arc;

#[test]
fn callback_receives_the_announced_count() {
    let state = AppState::seeded();
    let mut dispatcher = Dispatcher::default();
    dispatcher.register(Arc::new(SendCompletionNotice::default()));
    let job = RecalculateInventory::new(RecalculateInventory::DEFAULT_THRESHOLD);
    let mut seen = Vec::new();

    job.run_with_callback(&state.data, &dispatcher, |announced| seen.push(announced));

    assert_eq!(seen, vec![1]);
}

#[test]
fn command_run_and_job_run_are_different_functions() {
    let state = AppState::seeded();
    let dispatcher = Dispatcher::default();
    let job = RecalculateInventory::new(RecalculateInventory::DEFAULT_THRESHOLD);

    assert_eq!(
        atelier_app::commands::recalculate_inventory::run(&state),
        job.run(&state.data, &dispatcher)
    );
}
