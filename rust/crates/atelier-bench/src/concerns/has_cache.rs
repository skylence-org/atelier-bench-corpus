//! Namespaced cache keys.

pub trait HasCache {
    /// Prefix every key of this component shares.
    fn cache_namespace(&self) -> &'static str;

    fn cache_key_for(&self, suffix: &str) -> String {
        format!("{}:{suffix}", self.cache_namespace())
    }

    fn cache_ttl(&self) -> u64 {
        300
    }
}
