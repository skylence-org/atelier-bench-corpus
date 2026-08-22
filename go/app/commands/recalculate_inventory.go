package commands

import (
	"fmt"

	"atelier.example/lane/app"
	"atelier.example/lane/core/events"
)

// RecalculateInventory is the COMMAND. app.RecalculateInventory is the JOB
// with the SAME NAME in another package: one renders a console line, the
// other returns a JobResult, and only the import path tells them apart.
//
// It also announces every depleted part on the core event bus. That call
// crosses the package boundary app/commands -> core/events, which is the
// outgoing edge hierarchy-cross-package scores.
func RecalculateInventory(state *app.State) string {
	result := app.RecalculateInventory(state.Data)
	dispatcher := events.NewDispatcher()
	watch := (&events.StockWatch{}).Subscribe(dispatcher)
	for _, part := range state.Data.LowStockParts() {
		dispatcher.Dispatch(events.StockDepleted, events.Payload{"sku": part.SKU})
	}
	return fmt.Sprintf("%s: %d part(s) below reorder level, %s", result.Name, result.Handled, watch.Summary())
}
