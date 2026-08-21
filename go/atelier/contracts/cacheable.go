package contracts

// CacheableContract is the caching half of the composite contract.
type CacheableContract interface {
	CacheKey() string
	TTLSeconds() int
}
