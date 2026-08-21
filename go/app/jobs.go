package app

import (
	"fmt"
	"sync"
	"time"

	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/rules"
)

// JobResult is what every job shape reports back.
type JobResult struct {
	Name    string
	Handled int
}

// RunWithCallback is the CALLBACK shape: the continuation is passed in and
// called before the function returns.
func RunWithCallback(data *dataset.Dataset, done func(result JobResult)) {
	done(JobResult{Name: "callback", Handled: len(data.Orders)})
}

// RunWithChannel is the CHANNEL shape: the result arrives on a buffered
// channel the caller ranges over.
func RunWithChannel(data *dataset.Dataset) <-chan JobResult {
	results := make(chan JobResult, 1)
	go func() {
		defer close(results)
		results <- JobResult{Name: "channel", Handled: len(data.CompletedOrders())}
	}()
	return results
}

// RunWithGoroutines is the GOROUTINE shape: three workers, a WaitGroup and a
// select that takes whichever of the result channel or the timer fires first.
func RunWithGoroutines(data *dataset.Dataset) []JobResult {
	results := make(chan JobResult, 3)
	var group sync.WaitGroup
	for worker := 1; worker <= 3; worker++ {
		group.Add(1)
		go func(worker int) {
			defer group.Done()
			results <- JobResult{Name: fmt.Sprintf("worker-%d", worker), Handled: len(data.Orders)}
		}(worker)
	}
	group.Wait()
	close(results)

	collected := make([]JobResult, 0, 3)
	timeout := time.After(time.Second)
	for {
		select {
		case result, open := <-results:
			if !open {
				return collected
			}
			collected = append(collected, result)
		case <-timeout:
			return collected
		}
	}
}

// RecalculateInventory is the JOB. app/commands.RecalculateInventory is a
// DIFFERENT function with the SAME name in another package.
func RecalculateInventory(data *dataset.Dataset) JobResult {
	handled := 0
	for _, part := range data.Parts {
		if part.IsLowStock() {
			handled++
		}
	}
	return JobResult{Name: "recalculate-inventory", Handled: handled}
}

// SafeRun runs a job and turns a panic into an error with DEFER + RECOVER.
func SafeRun(job func() JobResult) (result JobResult, err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("job panicked: %v", recovered)
		}
	}()
	return job(), nil
}

// SatisfiedRules is how many of the 48 rules hold, used by the seed summary.
func SatisfiedRules(data *dataset.Dataset) int {
	return len(rules.Satisfied(data))
}
