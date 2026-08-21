//go:build brokenfixtures

package brokensyntax

// Intentionally invalid: the struct literal is never closed and the method
// body runs off the end of the file. Do not fix.
type Schedule struct {
	slots [8]bool

func (s *Schedule) BookSlot(slot int) bool {
	if slot < 0 {
		return false
	s.slots[slot] = true
	return true
