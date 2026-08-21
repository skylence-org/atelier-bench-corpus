package support

import (
	"fmt"
	"regexp"
	"strconv"
)

// Reference numbering constants, read as support.PrefixSeparator etc.
const (
	PrefixSeparator = "-"
	DefaultYear     = 2026
	FirstNumber     = 1
	AtelierPrefix   = "AT"
	CustomerPrefix  = "CU"
)

var referencePattern = regexp.MustCompile(`^([A-Z]{2})-(\d{4})-(\d{6})$`)

// FormatReference renders "AT-2026-000001".
func FormatReference(prefix string, number int) string {
	return fmt.Sprintf("%s%s%d%s%06d", prefix, PrefixSeparator, DefaultYear, PrefixSeparator, number)
}

// ParsedReference is the three-part split of a formatted reference.
type ParsedReference struct {
	Prefix string
	Year   int
	Number int
}

// ParseReference splits "AT-2026-000042" into its parts; ok is false on anything else.
func ParseReference(raw string) (ParsedReference, bool) {
	match := referencePattern.FindStringSubmatch(raw)
	if match == nil {
		return ParsedReference{}, false
	}
	year, _ := strconv.Atoi(match[2])
	number, _ := strconv.Atoi(match[3])
	return ParsedReference{Prefix: match[1], Year: year, Number: number}, true
}

// NextNumber is the successor in the reference sequence.
func NextNumber(current int) int {
	return current + 1
}
