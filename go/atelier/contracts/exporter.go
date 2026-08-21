package contracts

// ExporterContract is what all 8 exporters satisfy.
type ExporterContract interface {
	Extension() string
	Export(rows []ReportRow) string
}

// FormatterContract is the cell-level formatting contract.
type FormatterContract interface {
	FormatCell(value float64) string
}
