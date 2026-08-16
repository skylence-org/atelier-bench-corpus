//! `Deref`-based method forwarding.
//!
//! `technician.next_slot()` has no declaration on `Technician`; it resolves
//! through this `Deref` impl into [`crate::support::schedule::Schedule`].

use crate::models::technician::Technician;
use crate::support::schedule::Schedule;
use std::ops::{Deref, DerefMut};

impl Deref for Technician {
    type Target = Schedule;

    fn deref(&self) -> &Schedule {
        &self.schedule
    }
}

impl DerefMut for Technician {
    fn deref_mut(&mut self) -> &mut Schedule {
        &mut self.schedule
    }
}
