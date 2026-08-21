// Command atelier is the console entry point of the lane.
//
// The blank import below is the whole registration mechanism for the audit
// sink: nothing in this file calls into that package, and removing the import
// silently removes the sink.
package main

import (
	"fmt"
	"os"
	"strings"

	"atelier.example/lane/app"
	"atelier.example/lane/app/commands"
	_ "atelier.example/lane/internal/audit"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("usage: atelier <seed|report|export|recalculate>")
		os.Exit(2)
	}
	state := app.SeededState()
	lines, err := dispatch(state, os.Args[1], os.Args[2:])
	if err != nil {
		fmt.Fprintln(os.Stderr, "atelier:", err)
		os.Exit(1)
	}
	fmt.Println(strings.Join(lines, "\n"))
}

// dispatch selects a command by STRING, the way a console kernel does.
func dispatch(state *app.State, command string, args []string) ([]string, error) {
	switch command {
	case "seed":
		return append([]string{app.Summarize(state)}, append(app.MetricLines(state), app.RuleLine(state))...), nil
	case "report":
		if len(args) < 1 {
			return nil, fmt.Errorf("report needs a slug")
		}
		rendered, err := commands.ExportReport(state, args[0], "md")
		if err != nil {
			return nil, err
		}
		return strings.Split(rendered, "\n"), nil
	case "export":
		return strings.Split(commands.ExportManifest(state), "\n"), nil
	case "recalculate":
		return []string{commands.RecalculateInventory(state)}, nil
	default:
		return nil, fmt.Errorf("unknown command %q", command)
	}
}
