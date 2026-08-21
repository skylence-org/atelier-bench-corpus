package contracts

// Cadence is an iota enum: how often a periodic report runs.
type Cadence int

// The four cadences, coarsest last.
const (
	CadenceHourly Cadence = iota
	CadenceDaily
	CadenceWeekly
	CadenceMonthly
)

var cadenceNames = map[Cadence]string{
	CadenceHourly:  "hourly",
	CadenceDaily:   "daily",
	CadenceWeekly:  "weekly",
	CadenceMonthly: "monthly",
}

// String is the wire value of a cadence.
func (c Cadence) String() string {
	return cadenceNames[c]
}

// ScheduleContract is the scheduling half of the composite contract.
type ScheduleContract interface {
	Cadence() Cadence
}
