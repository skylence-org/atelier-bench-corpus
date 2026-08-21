//! The dedicated not-found error and its `?` conversion into the crate error.

use atelier_core::errors::{AtelierError, NotFoundError};

#[test]
fn not_found_renders_its_reference() {
    let error = NotFoundError::new("repair order", "AT-2026-999999");

    assert_eq!(
        error.to_string(),
        "no repair order with reference AT-2026-999999"
    );
}

#[test]
fn not_found_converts_into_the_crate_error() {
    let error: AtelierError = NotFoundError::new("repair order", "AT-2026-999999").into();

    assert_eq!(error.status_code(), 404);
    assert!(error.is_client_visible());
}
