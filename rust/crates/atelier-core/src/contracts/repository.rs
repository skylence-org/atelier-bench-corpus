//! Generic storage contract with an associated type.

/// Read-side storage abstraction. The associated `Id` is the interesting
/// navigation target: implementors pin it to concrete types.
pub trait Repository {
    /// Key type used to address a record.
    type Id: Copy + Eq;

    /// Stored record type.
    type Record;

    fn find(&self, id: Self::Id) -> Option<&Self::Record>;

    fn all(&self) -> &[Self::Record];

    fn count(&self) -> usize {
        self.all().len()
    }

    fn is_empty(&self) -> bool {
        self.count() == 0
    }
}
