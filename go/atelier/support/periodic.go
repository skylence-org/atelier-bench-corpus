package support

import "atelier.example/lane/atelier/contracts"

// PeriodicReport is level TWO: it embeds BaseReport, so Slug and CacheKey are
// now promoted twice, and adds the cadence of its own.
type PeriodicReport struct {
	BaseReport
	cadence contracts.Cadence
}

// NewPeriodicReport seeds the base and the cadence.
func NewPeriodicReport(slug string, title string, cadence contracts.Cadence) PeriodicReport {
	return PeriodicReport{BaseReport: NewBaseReport(slug, title), cadence: cadence}
}

// Cadence completes the ScheduleContract half of the composite.
func (p PeriodicReport) Cadence() contracts.Cadence {
	return p.cadence
}
