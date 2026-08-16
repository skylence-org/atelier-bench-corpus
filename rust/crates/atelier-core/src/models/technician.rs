//! Bench technician.

use crate::forwards_to_schedule;
use crate::support::schedule::Schedule;

/// Someone who works orders; owns a [`Schedule`] it forwards to.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct Technician {
    pub id: u32,
    pub name: String,
    pub(crate) schedule: Schedule,
}

impl Technician {
    pub fn new(id: u32, name: impl Into<String>) -> Self {
        Self {
            id,
            name: name.into(),
            schedule: Schedule::new(Schedule::DEFAULT_CAPACITY),
        }
    }

    /// Load factor between 0.0 and 1.0 for the utilisation metric.
    pub fn utilisation(&self) -> f64 {
        if self.schedule.capacity() == 0 {
            return 0.0;
        }

        self.schedule.booked_count() as f64 / f64::from(self.schedule.capacity())
    }
}

// Generated inherent methods: peek_next_slot / book_next_slot.
forwards_to_schedule!(Technician);
