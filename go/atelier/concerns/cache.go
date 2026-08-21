// Package concerns holds the eight EMBEDDABLE behaviour structs. A type that
// embeds one gains its whole method set by promotion, with no declaration of
// its own; embed two levels deep and the promotion chains.
package concerns

import "fmt"

// HasCache supplies the CacheableContract method set by promotion.
type HasCache struct {
	CachePrefix string
	CacheTTL    int
}

// CacheKey is promoted onto every embedder.
func (h HasCache) CacheKey() string {
	prefix := h.CachePrefix
	if prefix == "" {
		prefix = "atelier"
	}
	return fmt.Sprintf("%s:cache", prefix)
}

// TTLSeconds is promoted alongside it; 900 is the shared default.
func (h HasCache) TTLSeconds() int {
	if h.CacheTTL == 0 {
		return 900
	}
	return h.CacheTTL
}
