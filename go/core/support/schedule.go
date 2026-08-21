package support

// SlotCount is the number of bookable slots in a technician's day.
const SlotCount = 8

// Schedule is the booking sheet a technician EMBEDS. Its methods are promoted
// onto the embedding type without any of them being redeclared there.
type Schedule struct {
	slots [SlotCount]bool
}

// NewSchedule builds an empty sheet.
func NewSchedule() *Schedule {
	return &Schedule{}
}

// NextSlot returns the first free slot, or -1 when the day is full.
func (s *Schedule) NextSlot() int {
	for index, taken := range s.slots {
		if !taken {
			return index
		}
	}
	return -1
}

// BookSlot takes one slot and reports whether it was free.
func (s *Schedule) BookSlot(slot int) bool {
	if slot < 0 || slot >= SlotCount || s.slots[slot] {
		return false
	}
	s.slots[slot] = true
	return true
}

// BookedCount is how many slots are taken.
func (s *Schedule) BookedCount() int {
	booked := 0
	for _, taken := range s.slots {
		if taken {
			booked++
		}
	}
	return booked
}

// BookFirstFree uses a METHOD VALUE: `s.BookSlot` is a func(int) bool with the
// receiver already bound, passed around like any other value.
func (s *Schedule) BookFirstFree() bool {
	book := s.BookSlot
	next := s.NextSlot()
	if next < 0 {
		return false
	}
	return book(next)
}

// BookAll uses a METHOD EXPRESSION: `(*Schedule).BookSlot` is a
// func(*Schedule, int) bool whose first parameter IS the receiver.
func BookAll(schedule *Schedule, slots []int) int {
	booker := (*Schedule).BookSlot
	booked := 0
	for _, slot := range slots {
		if booker(schedule, slot) {
			booked++
		}
	}
	return booked
}
