package support

import "fmt"

// Choice is a closed sum type: only Left and Right satisfy it, and they do so
// STRUCTURALLY, without any implements keyword.
type Choice interface {
	IsLeft() bool
	Describe() string
}

// Left is the failure half.
type Left struct {
	Body     string
	Fallback string
}

// Right is the success half.
type Right struct {
	Value int
}

// LeftOf builds the failure half.
func LeftOf(body string, fallback string) Left {
	return Left{Body: body, Fallback: fallback}
}

// RightOf builds the success half.
func RightOf(value int) Right {
	return Right{Value: value}
}

// IsLeft is true on the failure half.
func (l Left) IsLeft() bool {
	return true
}

// Describe renders the failure half.
func (l Left) Describe() string {
	if l.Body == "" {
		return l.Fallback
	}
	return l.Body
}

// IsLeft is false on the success half.
func (r Right) IsLeft() bool {
	return false
}

// Describe renders the success half.
func (r Right) Describe() string {
	return fmt.Sprintf("%d", r.Value)
}

// DescribeChoice is the TYPE SWITCH: one arm per concrete type, plus the
// interface-typed default that catches anything added later.
func DescribeChoice(choice Choice) string {
	switch narrowed := choice.(type) {
	case Left:
		return "left:" + narrowed.Describe()
	case Right:
		return "right:" + narrowed.Describe()
	default:
		return "unknown:" + narrowed.Describe()
	}
}

// AnonymousSummary returns an ANONYMOUS STRUCT: a type with no name anywhere
// in the tree, declared and instantiated in the same expression.
func AnonymousSummary(choice Choice) struct {
	Kind string
	Text string
} {
	kind := "right"
	if choice.IsLeft() {
		kind = "left"
	}
	return struct {
		Kind string
		Text string
	}{Kind: kind, Text: choice.Describe()}
}
