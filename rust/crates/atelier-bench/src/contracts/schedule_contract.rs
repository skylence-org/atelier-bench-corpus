//! Recurrence.

/// How often a periodic component runs.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Cadence {
    Hourly,
    Daily,
    Weekly,
    Monthly,
}

impl Cadence {
    /// Nominal period length in seconds (a month is 30 days here).
    pub fn seconds(&self) -> u64 {
        match self {
            Cadence::Hourly => 3_600,
            Cadence::Daily => 86_400,
            Cadence::Weekly => 604_800,
            Cadence::Monthly => 2_592_000,
        }
    }
}

/// Anything that runs on a cadence.
pub trait ScheduleContract {
    fn cadence(&self) -> Cadence;

    /// Next run instant, aligned to the cadence grid.
    fn next_run_seconds(&self, now: u64) -> u64 {
        let period = self.cadence().seconds();

        now - (now % period) + period
    }
}
