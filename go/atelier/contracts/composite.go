package contracts

// CompositeContract has THREE PARENTS: Go builds it by embedding the three
// interfaces, so its method set is their union and no method is listed here.
type CompositeContract interface {
	ReportContract
	CacheableContract
	ScheduleContract
}

// AuditableContract is the fourth, deliberately NOT part of the composite.
type AuditableContract interface {
	Record(action string)
	AuditTrail() []string
}
