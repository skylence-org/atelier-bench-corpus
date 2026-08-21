package support

import "atelier.example/lane/atelier/concerns"

// BaseReport is level ONE of the chain: it embeds Component (Slug, Title) and
// HasCache (CacheKey, TTLSeconds). A report embedding BaseReport therefore
// satisfies three of the four contract methods without declaring any.
type BaseReport struct {
	Component
	concerns.HasCache
}

// NewBaseReport seeds both embedded halves.
func NewBaseReport(slug string, title string) BaseReport {
	return BaseReport{
		Component: NewComponent(slug, title),
		HasCache:  concerns.HasCache{CachePrefix: slug},
	}
}
