package events

import "fmt"

// StockWatch is the inventory-side listener. The recalculate command
// subscribes one, dispatches a stock.depleted event per depleted part and
// reports how many notices went out; that call is the one call-hierarchy edge
// in the lane that crosses the app package into core/events.
type StockWatch struct {
	Sent int
	Last string
}

// Handle records the SKU it was told about.
func (w *StockWatch) Handle(payload Payload) {
	w.Sent++
	w.Last = payload["sku"]
}

// Subscribe wires this listener to the stock event and returns itself.
func (w *StockWatch) Subscribe(dispatcher *Dispatcher) *StockWatch {
	dispatcher.Listen(StockDepleted, w)
	return w
}

// Summary renders what the watch saw.
func (w *StockWatch) Summary() string {
	if w.Sent == 0 {
		return "no notices"
	}
	return fmt.Sprintf("%d notice(s), last %s", w.Sent, w.Last)
}
