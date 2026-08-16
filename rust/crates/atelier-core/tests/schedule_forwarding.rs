//! Deref forwarding plus macro-generated inherent methods.

use atelier_core::models::technician::Technician;

#[test]
fn deref_exposes_schedule_methods() {
    let technician = Technician::new(1, "Ada");

    assert_eq!(technician.next_slot(), Some(0));
    assert_eq!(technician.capacity(), 16);
}

#[test]
fn macro_generated_methods_book_slots() {
    let mut technician = Technician::new(1, "Ada");

    assert_eq!(technician.book_next_slot(), Some(0));
    assert_eq!(technician.book_next_slot(), Some(1));
    assert_eq!(technician.peek_next_slot(), Some(2));
    assert_eq!(technician.booked_count(), 2);
}
