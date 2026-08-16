//! Base shared by all 24 reports.

use crate::concerns::has_cache::HasCache;
use crate::contracts::cacheable_contract::CacheableContract;
use crate::support::abstract_component::ComponentBase;

/// Identity plus rendering precision.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ReportBase {
    pub component: ComponentBase,
    pub decimals: u8,
}

impl ReportBase {
    pub const DEFAULT_DECIMALS: u8 = 2;

    pub const fn new(slug: &'static str, title: &'static str) -> Self {
        Self {
            component: ComponentBase::new(slug, title),
            decimals: Self::DEFAULT_DECIMALS,
        }
    }

    pub const fn slug(&self) -> &'static str {
        self.component.slug
    }

    pub const fn title(&self) -> &'static str {
        self.component.title
    }
}

impl HasCache for ReportBase {
    fn cache_namespace(&self) -> &'static str {
        "reports"
    }
}

impl CacheableContract for ReportBase {
    fn cache_key(&self) -> String {
        self.cache_key_for(self.slug())
    }
}
