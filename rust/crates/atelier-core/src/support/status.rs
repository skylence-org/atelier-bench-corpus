//! Repair lifecycle states.

use serde::{Deserialize, Serialize};
use std::fmt;

/// Lifecycle state of a [`crate::models::repair_order::RepairOrder`].
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RepairStatus {
    Received,
    Diagnosing,
    AwaitingParts,
    Repairing,
    Completed,
    Collected,
}

impl RepairStatus {
    /// States reachable in one hop from `self`.
    pub fn transitions_to(&self) -> &'static [RepairStatus] {
        match self {
            RepairStatus::Received => &[RepairStatus::Diagnosing],
            RepairStatus::Diagnosing => &[RepairStatus::AwaitingParts, RepairStatus::Repairing],
            RepairStatus::AwaitingParts => &[RepairStatus::Repairing],
            RepairStatus::Repairing => &[RepairStatus::Completed],
            RepairStatus::Completed => &[RepairStatus::Collected],
            RepairStatus::Collected => &[],
        }
    }

    /// Human label for report and admin surfaces.
    pub fn label(&self) -> &'static str {
        match self {
            RepairStatus::Received => "Received",
            RepairStatus::Diagnosing => "Diagnosing",
            RepairStatus::AwaitingParts => "Awaiting parts",
            RepairStatus::Repairing => "Repairing",
            RepairStatus::Completed => "Completed",
            RepairStatus::Collected => "Collected",
        }
    }

    /// No further transition is possible from a terminal state.
    pub fn is_terminal(&self) -> bool {
        self.transitions_to().is_empty()
    }

    /// Is the order still occupying bench space?
    pub fn is_open(&self) -> bool {
        !matches!(self, RepairStatus::Completed | RepairStatus::Collected)
    }

    pub fn slug(&self) -> &'static str {
        match self {
            RepairStatus::Received => "received",
            RepairStatus::Diagnosing => "diagnosing",
            RepairStatus::AwaitingParts => "awaiting_parts",
            RepairStatus::Repairing => "repairing",
            RepairStatus::Completed => "completed",
            RepairStatus::Collected => "collected",
        }
    }
}

impl fmt::Display for RepairStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.label())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn collected_is_terminal() {
        assert!(RepairStatus::Collected.is_terminal());
        assert!(!RepairStatus::Repairing.is_terminal());
    }

    #[test]
    fn diagnosing_forks_two_ways() {
        assert_eq!(RepairStatus::Diagnosing.transitions_to().len(), 2);
    }
}
