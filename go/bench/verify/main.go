// Command verify is the go lane's self-check for bench/tasks.json.
//
//	go run ./bench/verify                 # resolve every file+needle pair
//	go run ./bench/verify --lint          # build + vet + gofmt + broken-fixture guard
//	go run ./bench/verify --root <dir>    # verify another lane-shaped directory
//
// Standard library only. Exit 0 only when every check passes. The stdout
// contract is byte-identical to php/bench/verify_tasks.php,
// python/bench/verify_tasks.py, rust/bench/verify-tasks and the two
// verify.mjs files, which bench/check-matrix.mjs proves on bench/conformance.
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// lineSplit matches the three line terminators, so CRLF files resolve like LF.
var lineSplit = regexp.MustCompile("\r\n|\n|\r")

// fileNeedle is one {file, needle} pair.
type fileNeedle struct {
	File   string `json:"file"`
	Needle string `json:"needle"`
}

// ok reports whether both halves are present, matching the other verifiers.
func (f *fileNeedle) ok() bool {
	return f != nil && f.File != "" && f.Needle != ""
}

// expectBlock is the ground truth of one task. Non-needle keys (contains,
// behavior, must_include, must_not_include, min_*, exact_count, kind,
// resolution) are ignored by design.
type expectBlock struct {
	File             string       `json:"file"`
	Needle           string       `json:"needle"`
	KnownSites       []fileNeedle `json:"known_sites"`
	Implementations  []fileNeedle `json:"implementations"`
	KnownCallers     []fileNeedle `json:"known_callers"`
	OutgoingIncludes []fileNeedle `json:"outgoing_includes"`
	IncomingIncludes []fileNeedle `json:"incoming_includes"`
	Candidate        *fileNeedle  `json:"candidate"`
}

// task is one entry of bench/tasks.json.
type task struct {
	ID      string       `json:"id"`
	Surface string       `json:"surface"`
	From    *fileNeedle  `json:"from"`
	Expect  *expectBlock `json:"expect"`
}

// manifest is the whole file.
type manifest struct {
	Tasks []task `json:"tasks"`
}

// pair is one needle to resolve, tagged with the role it plays.
type pair struct {
	file   string
	needle string
	role   string
}

func main() {
	os.Exit(run(os.Args[1:]))
}

// run is main without the exit, so every branch is testable.
func run(args []string) int {
	root := resolveRoot(args)
	if contains(args, "--lint") {
		return runLint(root)
	}
	return runTasks(root)
}

// resolveRoot is the lane root: the working directory unless --root says otherwise.
func resolveRoot(args []string) string {
	for index, arg := range args {
		if arg == "--root" && index+1 < len(args) {
			absolute, err := filepath.Abs(args[index+1])
			if err != nil {
				return args[index+1]
			}
			return absolute
		}
	}
	return "."
}

func contains(args []string, flag string) bool {
	for _, arg := range args {
		if arg == flag {
			return true
		}
	}
	return false
}

// summarize caps a needle at 80 characters, 77 plus an ellipsis.
func summarize(needle string) string {
	if len(needle) <= 80 {
		return needle
	}
	return needle[:77] + "..."
}

// collectPairs lists every {file, needle} a task carries, in document order.
func collectPairs(entry task) []pair {
	pairs := []pair{}
	if entry.From.ok() {
		pairs = append(pairs, pair{file: entry.From.File, needle: entry.From.Needle, role: "from"})
	}
	if entry.Expect == nil {
		return pairs
	}
	if entry.Expect.File != "" && entry.Expect.Needle != "" {
		pairs = append(pairs, pair{file: entry.Expect.File, needle: entry.Expect.Needle, role: "expect"})
	}
	for _, group := range [][]fileNeedle{
		entry.Expect.KnownSites,
		entry.Expect.Implementations,
		entry.Expect.KnownCallers,
		entry.Expect.OutgoingIncludes,
		entry.Expect.IncomingIncludes,
	} {
		for index := range group {
			if group[index].ok() {
				pairs = append(pairs, pair{file: group[index].File, needle: group[index].Needle, role: "expect"})
			}
		}
	}
	if entry.Expect.Candidate.ok() {
		pairs = append(pairs, pair{file: entry.Expect.Candidate.File, needle: entry.Expect.Candidate.Needle, role: "expect"})
	}
	return pairs
}

// resolveNeedle resolves one pair to its unique 1-based line, or explains why not.
func resolveNeedle(root string, file string, needle string) (int, string) {
	path := filepath.Join(root, file)
	info, err := os.Stat(path)
	if err != nil || info.IsDir() {
		return 0, "file missing"
	}
	content, err := os.ReadFile(path)
	if err != nil {
		return 0, "unreadable"
	}
	hits := []int{}
	for index, line := range lineSplit.Split(string(content), -1) {
		if strings.Contains(line, needle) {
			hits = append(hits, index+1)
		}
	}
	if len(hits) != 1 {
		return 0, fmt.Sprintf("found %d times", len(hits))
	}
	return hits[0], ""
}

// runTasks is the default mode: resolve every needle of every task.
func runTasks(root string) int {
	raw, err := os.ReadFile(filepath.Join(root, "bench", "tasks.json"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "FAIL: cannot read %s\n", filepath.Join(root, "bench", "tasks.json"))
		return 1
	}
	var parsed manifest
	if err := json.Unmarshal(raw, &parsed); err != nil {
		fmt.Fprintf(os.Stderr, "FAIL: tasks.json is not valid JSON: %v\n", err)
		return 1
	}

	anyFail := false
	for _, entry := range parsed.Tasks {
		if entry.ID == "" {
			fmt.Fprintln(os.Stderr, "FAIL: task missing id")
			anyFail = true
			continue
		}
		fromLine := 0
		expectResolved := 0
		failures := []string{}
		for _, item := range collectPairs(entry) {
			line, reason := resolveNeedle(root, item.file, item.needle)
			switch {
			case reason != "":
				failures = append(failures, fmt.Sprintf("%s: FAIL %s needle %s (%s)", entry.ID, item.file, summarize(item.needle), reason))
			case item.role == "from":
				fromLine = line
			default:
				expectResolved++
			}
		}
		if len(failures) > 0 {
			anyFail = true
			for _, failure := range failures {
				fmt.Println(failure)
			}
			continue
		}
		fromFile := "?"
		if entry.From != nil && entry.From.File != "" {
			fromFile = entry.From.File
		}
		fromDisplay := fmt.Sprintf("%s:?", fromFile)
		if fromLine > 0 {
			fromDisplay = fmt.Sprintf("%s:%d", fromFile, fromLine)
		}
		fmt.Printf("%s: OK (from %s -> %d expect needles resolved)\n", entry.ID, fromDisplay, expectResolved)
	}
	if anyFail {
		return 1
	}
	return 0
}
