// Package support holds the embeddable BASE structs. Go has no abstract
// class: a report embeds a base, inherits its whole method set by promotion,
// and declares only the one method the base leaves out.
package support

import "fmt"

// Component is the root of every embedding chain in the lane.
type Component struct {
	slug  string
	title string
}

// NewComponent seeds the root.
func NewComponent(slug string, title string) Component {
	return Component{slug: slug, title: title}
}

// Slug is promoted all the way up to the concrete reports.
func (c Component) Slug() string {
	return c.slug
}

// Title is promoted alongside Slug.
func (c Component) Title() string {
	return c.title
}

// Describe renders "slug (title)".
func (c Component) Describe() string {
	return fmt.Sprintf("%s (%s)", c.slug, c.title)
}
