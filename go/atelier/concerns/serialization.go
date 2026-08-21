package concerns

import (
	"encoding/json"
	"strings"
)

// HasSerialization supplies JSON rendering by promotion.
type HasSerialization struct {
	Indent bool
}

// ToJSON renders any value; an unmarshalable value degrades to "{}".
func (h HasSerialization) ToJSON(value any) string {
	var (
		encoded []byte
		err     error
	)
	if h.Indent {
		encoded, err = json.MarshalIndent(value, "", "  ")
	} else {
		encoded, err = json.Marshal(value)
	}
	if err != nil {
		return "{}"
	}
	return strings.TrimSpace(string(encoded))
}
