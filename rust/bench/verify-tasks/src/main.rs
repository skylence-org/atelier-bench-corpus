//! Self-check for `bench/tasks.json`.
//!
//! ```text
//! cargo run -p bench-verify            # resolve every file+needle pair
//! cargo run -p bench-verify -- --lint  # cargo check + broken-fixture guard
//! ```
//!
//! Exit 0 only when every check passes. Mirrors `php/bench/verify_tasks.php`
//! line for line so the two lanes can be scored the same way.

mod json;

use json::Json;
use std::path::{Path, PathBuf};
use std::process::{Command, ExitCode};

/// Role a needle plays inside its task.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Role {
    From,
    Expect,
}

/// One resolvable (file, needle) pair.
#[derive(Debug, Clone)]
struct NeedlePair {
    file: String,
    needle: String,
    role: Role,
}

/// Nested expect keys that hold arrays of {file, needle} objects.
const NESTED_KEYS: [&str; 4] = [
    "known_sites",
    "implementations",
    "known_callers",
    "outgoing_includes",
];

fn main() -> ExitCode {
    let flags: Vec<String> = std::env::args().skip(1).collect();
    let root = lane_root(&flags);

    if flags.iter().any(|flag| flag == "--lint") {
        return run_lint(&root);
    }

    run_tasks(&root)
}

/// The lane root (`rust/`): `--root <dir>` when given, else resolved the same
/// way whether this was built by cargo or by a bare `rustc src/main.rs`.
fn lane_root(flags: &[String]) -> PathBuf {
    if let Some(index) = flags.iter().position(|flag| flag == "--root") {
        if let Some(dir) = flags.get(index + 1) {
            return PathBuf::from(dir);
        }
    }

    match option_env!("CARGO_MANIFEST_DIR") {
        Some(manifest) => Path::new(manifest)
            .parent()
            .and_then(Path::parent)
            .map(Path::to_path_buf)
            .unwrap_or_else(|| PathBuf::from(".")),
        None => std::env::current_dir().unwrap_or_else(|_| PathBuf::from(".")),
    }
}

fn run_tasks(root: &Path) -> ExitCode {
    let manifest_path = root.join("bench/tasks.json");
    let raw = match std::fs::read_to_string(&manifest_path) {
        Ok(raw) => raw,
        Err(error) => {
            eprintln!("FAIL: cannot read {}: {error}", manifest_path.display());

            return ExitCode::FAILURE;
        }
    };

    let document = match json::parse(&raw) {
        Ok(document) => document,
        Err(error) => {
            eprintln!("FAIL: tasks.json is not valid JSON: {error}");

            return ExitCode::FAILURE;
        }
    };

    let Some(tasks) = document.get("tasks").and_then(Json::as_array) else {
        eprintln!("FAIL: tasks.json missing tasks array");

        return ExitCode::FAILURE;
    };

    let mut any_fail = false;

    for task in tasks {
        let Some(id) = task.get("id").and_then(Json::as_str) else {
            eprintln!("FAIL: task missing id");
            any_fail = true;
            continue;
        };

        let pairs = collect_needle_pairs(task);
        let mut from_line: Option<usize> = None;
        let mut expect_resolved = 0usize;
        let mut failures: Vec<String> = Vec::new();

        for pair in &pairs {
            match resolve(root, pair) {
                Ok(line) => match pair.role {
                    Role::From => from_line = Some(line),
                    Role::Expect => expect_resolved += 1,
                },
                Err(reason) => failures.push(format!(
                    "{id}: FAIL {} needle {} ({reason})",
                    pair.file,
                    summarize(&pair.needle)
                )),
            }
        }

        if !failures.is_empty() {
            any_fail = true;
            for failure in failures {
                println!("{failure}");
            }
            continue;
        }

        let from_file = task
            .get("from")
            .and_then(|from| from.get("file"))
            .and_then(Json::as_str)
            .unwrap_or("?");
        let from_display = match from_line {
            Some(line) => format!("{from_file}:{line}"),
            None => format!("{from_file}:?"),
        };

        println!("{id}: OK (from {from_display} -> {expect_resolved} expect needles resolved)");
    }

    if any_fail {
        return ExitCode::FAILURE;
    }

    ExitCode::SUCCESS
}

/// Resolve one pair to its unique 1-based line, or explain why it did not.
fn resolve(root: &Path, pair: &NeedlePair) -> Result<usize, String> {
    let path = root.join(&pair.file);
    if !path.is_file() {
        return Err("file missing".to_string());
    }

    let content = std::fs::read_to_string(&path).map_err(|_| "unreadable".to_string())?;
    let hits: Vec<usize> = content
        .lines()
        .enumerate()
        .filter(|(_, line)| line.contains(&pair.needle))
        .map(|(index, _)| index + 1)
        .collect();

    match hits.len() {
        1 => Ok(hits[0]),
        n => Err(format!("found {n} times")),
    }
}

/// Every {file, needle} pair a task carries, in document order.
fn collect_needle_pairs(task: &Json) -> Vec<NeedlePair> {
    let mut pairs = Vec::new();

    if let Some((file, needle)) = task.get("from").and_then(Json::file_needle) {
        pairs.push(NeedlePair {
            file: file.to_string(),
            needle: needle.to_string(),
            role: Role::From,
        });
    }

    let Some(expect) = task.get("expect") else {
        return pairs;
    };

    if let Some((file, needle)) = expect.file_needle() {
        pairs.push(NeedlePair {
            file: file.to_string(),
            needle: needle.to_string(),
            role: Role::Expect,
        });
    }

    for key in NESTED_KEYS {
        let Some(items) = expect.get(key).and_then(Json::as_array) else {
            continue;
        };

        for item in items {
            if let Some((file, needle)) = item.file_needle() {
                pairs.push(NeedlePair {
                    file: file.to_string(),
                    needle: needle.to_string(),
                    role: Role::Expect,
                });
            }
        }
    }

    if let Some((file, needle)) = expect.get("candidate").and_then(Json::file_needle) {
        pairs.push(NeedlePair {
            file: file.to_string(),
            needle: needle.to_string(),
            role: Role::Expect,
        });
    }

    // Non-needle expect keys (contains, behavior, must_include, min_*, kind,
    // resolution) are ignored by design.
    pairs
}

fn summarize(needle: &str) -> String {
    if needle.chars().count() <= 80 {
        return needle.to_string();
    }

    let head: String = needle.chars().take(77).collect();

    format!("{head}...")
}

/// `--lint`: the whole workspace must compile, and every broken fixture must
/// still fail to compile.
fn run_lint(root: &Path) -> ExitCode {
    let check = Command::new("cargo")
        .args(["check", "--workspace", "--all-targets", "--quiet"])
        .current_dir(root)
        .status();

    match check {
        Ok(status) if status.success() => println!("lint: OK (cargo check --workspace)"),
        Ok(status) => {
            println!("lint: FAIL (cargo check exited {status})");

            return ExitCode::FAILURE;
        }
        Err(error) => {
            println!("lint: FAIL (cargo not runnable: {error})");

            return ExitCode::FAILURE;
        }
    }

    let fixtures = root.join("fixtures/broken-syntax");
    let Ok(entries) = std::fs::read_dir(&fixtures) else {
        println!("lint: FAIL (missing {})", fixtures.display());

        return ExitCode::FAILURE;
    };

    let mut checked = 0usize;
    for entry in entries.flatten() {
        let path = entry.path();
        if path.extension().and_then(|ext| ext.to_str()) != Some("rs") {
            continue;
        }

        let compiled = Command::new("rustc")
            .args([
                "--edition",
                "2024",
                "--crate-type",
                "lib",
                "--emit",
                "metadata",
                "-o",
            ])
            .arg("/dev/null")
            .arg(&path)
            .output();

        match compiled {
            Ok(output) if output.status.success() => {
                println!("lint: FAIL ({} compiled; it must not)", path.display());

                return ExitCode::FAILURE;
            }
            Ok(_) => checked += 1,
            Err(error) => {
                println!("lint: FAIL (rustc not runnable: {error})");

                return ExitCode::FAILURE;
            }
        }
    }

    println!("lint: OK ({checked} broken fixture(s) still refuse to compile)");

    ExitCode::SUCCESS
}
