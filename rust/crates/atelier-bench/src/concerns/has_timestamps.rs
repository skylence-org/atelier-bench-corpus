//! Created/updated stamps.

use chrono::{DateTime, Utc};

pub trait HasTimestamps {
    fn created_at(&self) -> DateTime<Utc>;

    fn updated_at(&self) -> Option<DateTime<Utc>> {
        None
    }

    /// Age against an explicit `now`, so tests stay deterministic.
    fn age_seconds(&self, now: DateTime<Utc>) -> i64 {
        (now - self.created_at()).num_seconds()
    }
}

/// Wrapper that stamps any payload with a fixed creation instant.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Stamped<T> {
    pub payload: T,
    pub created: DateTime<Utc>,
}

impl<T> Stamped<T> {
    /// Frozen epoch used across the corpus: 2026-07-16T08:00:00Z.
    pub const FROZEN_EPOCH: i64 = 1_784_188_800;

    pub fn frozen(payload: T) -> Self {
        Self {
            payload,
            created: DateTime::from_timestamp(Self::FROZEN_EPOCH, 0)
                .expect("FROZEN_EPOCH is a valid instant"),
        }
    }
}

impl<T> HasTimestamps for Stamped<T> {
    fn created_at(&self) -> DateTime<Utc> {
        self.created
    }
}
