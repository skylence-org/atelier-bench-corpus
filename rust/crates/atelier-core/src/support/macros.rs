//! Declarative macros that generate methods.
//!
//! Methods produced by [`forwards_to_schedule!`] have no textual declaration
//! at their call site, so a name-based lookup can only report the macro.

/// Generate schedule-forwarding inherent methods on a type that owns a
/// `schedule` field.
#[macro_export]
macro_rules! forwards_to_schedule {
    ($owner:ty) => {
        impl $owner {
            /// Generated: first free slot on this technician's day.
            pub fn peek_next_slot(&self) -> Option<$crate::support::schedule::SlotIndex> {
                self.schedule.next_slot()
            }

            /// Generated: book the first free slot, returning it.
            pub fn book_next_slot(&mut self) -> Option<$crate::support::schedule::SlotIndex> {
                let slot = self.schedule.next_slot()?;
                self.schedule.book_slot(slot).then_some(slot)
            }
        }
    };
}

/// Declare a newtype counter with a fixed step, generating `bump` and `get`.
#[macro_export]
macro_rules! define_counter {
    ($name:ident, step = $step:expr) => {
        #[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
        pub struct $name(u32);

        impl $name {
            pub const STEP: u32 = $step;

            pub fn bump(&mut self) -> u32 {
                self.0 = self.0.saturating_add(Self::STEP);
                self.0
            }

            pub fn get(&self) -> u32 {
                self.0
            }
        }
    };
}
