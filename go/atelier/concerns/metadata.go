package concerns

import "sort"

// HasMetadata supplies a string map by promotion.
type HasMetadata struct {
	meta map[string]string
}

// SetMeta writes one key, allocating the map on first use.
func (h *HasMetadata) SetMeta(key string, value string) {
	if h.meta == nil {
		h.meta = map[string]string{}
	}
	h.meta[key] = value
}

// Meta reads one key.
func (h *HasMetadata) Meta(key string) (string, bool) {
	value, found := h.meta[key]
	return value, found
}

// MetaKeys lists the keys, sorted, because map order is random in Go.
func (h *HasMetadata) MetaKeys() []string {
	keys := make([]string, 0, len(h.meta))
	for key := range h.meta {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}
