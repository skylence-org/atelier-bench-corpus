//! Cache addressing.

pub trait CacheableContract {
    /// Fully qualified cache key.
    fn cache_key(&self) -> String;

    /// Lifetime in seconds; zero disables caching entirely.
    fn ttl_seconds(&self) -> u64 {
        300
    }

    fn is_cacheable(&self) -> bool {
        self.ttl_seconds() > 0
    }
}
