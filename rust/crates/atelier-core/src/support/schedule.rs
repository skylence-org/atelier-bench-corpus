//! Technician scheduling.
//!
//! [`crate::models::technician::Technician`] forwards to this type through
//! `Deref`, so `technician.next_slot()` resolves to a method declared here.

use indexmap::IndexSet;

/// Half-hour slot index inside a working day (0 == 08:00).
pub type SlotIndex = u8;

/// Booked-slot ledger for one technician.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct Schedule {
    booked: IndexSet<SlotIndex>,
    capacity: SlotIndex,
}

impl Schedule {
    /// Slots in a working day when no explicit capacity is given.
    pub const DEFAULT_CAPACITY: SlotIndex = 16;

    pub fn new(capacity: SlotIndex) -> Self {
        Self {
            booked: IndexSet::new(),
            capacity,
        }
    }

    /// First free slot, or `None` when the day is full.
    pub fn next_slot(&self) -> Option<SlotIndex> {
        (0..self.capacity).find(|slot| !self.booked.contains(slot))
    }

    /// Book `slot`; returns false when it was already taken or out of range.
    pub fn book_slot(&mut self, slot: SlotIndex) -> bool {
        if slot >= self.capacity {
            return false;
        }

        self.booked.insert(slot)
    }

    pub fn booked_count(&self) -> usize {
        self.booked.len()
    }

    pub fn capacity(&self) -> SlotIndex {
        self.capacity
    }
}

impl Default for ScheduleBuilder {
    fn default() -> Self {
        Self {
            capacity: Schedule::DEFAULT_CAPACITY,
        }
    }
}

/// Builder kept separate so `Schedule::default()` stays an empty ledger while
/// the builder default carries the capacity policy.
#[derive(Debug, Clone, Copy)]
pub struct ScheduleBuilder {
    capacity: SlotIndex,
}

impl ScheduleBuilder {
    pub fn capacity(mut self, capacity: SlotIndex) -> Self {
        self.capacity = capacity;
        self
    }

    pub fn build(self) -> Schedule {
        Schedule::new(self.capacity)
    }
}
