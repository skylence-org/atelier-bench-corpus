package tests

import (
	"strings"
	"testing"

	"atelier.example/lane/app"
	"atelier.example/lane/app/commands"
)

func TestTheThreeJobShapesAgree(t *testing.T) {
	data := seeded()

	var fromCallback app.JobResult
	app.RunWithCallback(data, func(result app.JobResult) {
		fromCallback = result
	})
	if fromCallback.Name != "callback" || fromCallback.Handled != 4 {
		t.Errorf("callback = %+v", fromCallback)
	}

	fromChannel := <-app.RunWithChannel(data)
	if fromChannel.Name != "channel" || fromChannel.Handled != 1 {
		t.Errorf("channel = %+v", fromChannel)
	}

	fromGoroutines := app.RunWithGoroutines(data)
	if len(fromGoroutines) != 3 {
		t.Fatalf("goroutines returned %d results, want 3", len(fromGoroutines))
	}
	for _, result := range fromGoroutines {
		if !strings.HasPrefix(result.Name, "worker-") || result.Handled != 4 {
			t.Errorf("worker result = %+v", result)
		}
	}
}

func TestSafeRunRecoversAPanic(t *testing.T) {
	result, err := app.SafeRun(func() app.JobResult {
		panic("inventory feed unavailable")
	})
	if err == nil {
		t.Fatal("SafeRun should turn the panic into an error")
	}
	if !strings.Contains(err.Error(), "inventory feed unavailable") {
		t.Errorf("error = %v", err)
	}
	if result.Handled != 0 {
		t.Errorf("result = %+v", result)
	}

	ok, err := app.SafeRun(func() app.JobResult {
		return app.JobResult{Name: "clean", Handled: 1}
	})
	if err != nil || ok.Name != "clean" {
		t.Errorf("clean run = %+v / %v", ok, err)
	}
}

func TestSameNameCommandAndJobAreDifferentFunctions(t *testing.T) {
	state := app.SeededState()
	job := app.RecalculateInventory(state.Data)
	line := commands.RecalculateInventory(state)
	if job.Name != "recalculate-inventory" || job.Handled != 2 {
		t.Errorf("job = %+v", job)
	}
	if line != "recalculate-inventory: 2 part(s) below reorder level" {
		t.Errorf("command = %s", line)
	}
}

func TestExportGoesThroughTheStringKeyedRegistry(t *testing.T) {
	state := app.SeededState()
	rendered, err := commands.ExportReport(state, "gross-profit", "csv")
	if err != nil {
		t.Fatalf("export: %v", err)
	}
	if !strings.HasPrefix(rendered, "revenue,58325.00") {
		t.Errorf("csv = %q", rendered)
	}
	if _, err := commands.ExportReport(state, "gross-profit", "nope"); err == nil {
		t.Error("unknown format should fail")
	}
	manifest := commands.ExportManifest(state)
	if !strings.Contains(manifest, "revenue: 58325") || !strings.Contains(manifest, "version: v2") {
		t.Errorf("manifest = %q", manifest)
	}
}
