//! Closure stored in a struct field.

use crate::dataset::Dataset;

/// Wraps an ad hoc predicate over a [`Dataset`].
pub struct ClosurePredicate {
    check: Box<dyn Fn(&Dataset) -> bool + Send + Sync>,
}

impl ClosurePredicate {
    pub fn new(check: Box<dyn Fn(&Dataset) -> bool + Send + Sync>) -> Self {
        Self { check }
    }

    pub fn matches(&self, data: &Dataset) -> bool {
        (self.check)(data)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn invokes_stored_closure() {
        let predicate = ClosurePredicate::new(Box::new(|data: &Dataset| !data.orders.is_empty()));

        assert!(predicate.matches(&Dataset::seeded()));
    }
}
