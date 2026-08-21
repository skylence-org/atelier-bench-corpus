package models

import "fmt"

// Device is the thing being repaired.
type Device struct {
	ID         int
	CustomerID int
	Brand      string
	Model      string
	Serial     string
}

// NewDevice builds a device; an empty serial means "not recorded".
func NewDevice(id int, customerID int, brand string, model string, serial string) *Device {
	return &Device{ID: id, CustomerID: customerID, Brand: brand, Model: model, Serial: serial}
}

// Label renders "Framework 13 (SER-0001)".
func (d *Device) Label() string {
	if d.Serial == "" {
		return fmt.Sprintf("%s %s", d.Brand, d.Model)
	}
	return fmt.Sprintf("%s %s (%s)", d.Brand, d.Model, d.Serial)
}
