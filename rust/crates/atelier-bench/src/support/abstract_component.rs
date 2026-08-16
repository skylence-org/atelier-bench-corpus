//! Shared identity for every component in the lane.
//!
//! Rust has no abstract classes: the PHP lane's `AbstractComponent` becomes a
//! composed base struct plus trait default bodies.

use crate::concerns::has_logging::HasLogging;

/// Slug + title, held by every other base.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ComponentBase {
    pub slug: &'static str,
    pub title: &'static str,
}

impl ComponentBase {
    pub const fn new(slug: &'static str, title: &'static str) -> Self {
        Self { slug, title }
    }

    pub const fn slug(&self) -> &'static str {
        self.slug
    }

    pub const fn title(&self) -> &'static str {
        self.title
    }
}

impl HasLogging for ComponentBase {
    fn log_target(&self) -> &'static str {
        self.slug
    }
}
