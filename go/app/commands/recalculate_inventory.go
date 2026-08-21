package commands

import (
	"fmt"

	"atelier.example/lane/app"
)

// RecalculateInventory is the COMMAND. app.RecalculateInventory is the JOB
// with the SAME NAME in another package: one renders a console line, the
// other returns a JobResult, and only the import path tells them apart.
func RecalculateInventory(state *app.State) string {
	result := app.RecalculateInventory(state.Data)
	return fmt.Sprintf("%s: %d part(s) below reorder level", result.Name, result.Handled)
}
