#!/usr/bin/env python3
"""
Self-check for bench/tasks.json needle uniqueness (python lane).

    python3 bench/verify_tasks.py                    # resolve every file+needle pair
    python3 bench/verify_tasks.py --lint             # py_compile over the lane + broken-fixture guard + mypy allowlist gate
    python3 bench/verify_tasks.py --lint --write-allowlist   # regenerate bench/mypy-allowlist.txt
    python3 bench/verify_tasks.py --root <dir>       # verify another lane-shaped directory

Standard library only. Exit 0 only when every check passes. Mirrors
php/bench/verify_tasks.php, rust/bench/verify-tasks and the two verify.mjs
files line for line, so every lane is scored the same way.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

NESTED_KEYS = ("known_sites", "implementations", "known_callers", "outgoing_includes")
SPLIT = re.compile(r"\r\n|\n|\r")
PACKAGES = ("atelier_core", "atelier_bench", "atelier_app")


def resolve_root(flags: list[str]) -> Path:
    """Lane root = the directory containing bench/, unless --root <dir> is given."""
    if "--root" in flags:
        index = flags.index("--root")
        if index + 1 < len(flags):
            return Path(flags[index + 1]).resolve()
    return Path(__file__).resolve().parent.parent


def summarize(needle: str) -> str:
    if len(needle) <= 80:
        return needle
    return needle[:77] + "..."


def is_file_needle(value: object) -> bool:
    return isinstance(value, dict) and isinstance(value.get("file"), str) and isinstance(value.get("needle"), str)


def collect_needle_pairs(task: dict) -> list[tuple[str, str, str]]:
    """Every {file, needle} pair a task carries, in document order. Roles: from | expect."""
    pairs: list[tuple[str, str, str]] = []
    source = task.get("from")
    if is_file_needle(source):
        pairs.append((source["file"], source["needle"], "from"))
    expect = task.get("expect")
    if not isinstance(expect, dict):
        return pairs
    if is_file_needle(expect):
        pairs.append((expect["file"], expect["needle"], "expect"))
    for key in NESTED_KEYS:
        items = expect.get(key)
        if not isinstance(items, list):
            continue
        for item in items:
            if is_file_needle(item):
                pairs.append((item["file"], item["needle"], "expect"))
    candidate = expect.get("candidate")
    if is_file_needle(candidate):
        pairs.append((candidate["file"], candidate["needle"], "expect"))
    # Non-needle expect keys (contains, behavior, must_include, must_not_include,
    # min_*, exact_count, kind, resolution) are ignored by design.
    return pairs


def resolve_needle(root: Path, file: str, needle: str) -> tuple[bool, str | int]:
    """Resolve one pair to its unique 1-based line, or explain why it did not."""
    path = root / file
    if not path.is_file():
        return False, "file missing"
    try:
        content = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return False, "unreadable"
    hits = [index + 1 for index, line in enumerate(SPLIT.split(content)) if needle in line]
    if len(hits) != 1:
        return False, f"found {len(hits)} times"
    return True, hits[0]


def run_tasks(root: Path) -> int:
    manifest = root / "bench" / "tasks.json"
    try:
        raw = manifest.read_text(encoding="utf-8")
    except OSError:
        sys.stderr.write(f"FAIL: cannot read {manifest}\n")
        return 1
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as error:
        sys.stderr.write(f"FAIL: tasks.json is not valid JSON: {error}\n")
        return 1
    if not isinstance(data, dict) or not isinstance(data.get("tasks"), list):
        sys.stderr.write("FAIL: tasks.json missing tasks array\n")
        return 1

    any_fail = False
    for task in data["tasks"]:
        if not isinstance(task, dict) or not isinstance(task.get("id"), str):
            sys.stderr.write("FAIL: task missing id\n")
            any_fail = True
            continue
        task_id = task["id"]
        from_line: int | None = None
        expect_resolved = 0
        failures: list[str] = []
        for file, needle, role in collect_needle_pairs(task):
            ok, result = resolve_needle(root, file, needle)
            if ok:
                if role == "from":
                    from_line = int(result)
                else:
                    expect_resolved += 1
            else:
                failures.append(f"{task_id}: FAIL {file} needle {summarize(needle)} ({result})")
        if failures:
            any_fail = True
            for failure in failures:
                sys.stdout.write(failure + "\n")
            continue
        source = task.get("from")
        from_file = source["file"] if isinstance(source, dict) and isinstance(source.get("file"), str) else "?"
        from_display = f"{from_file}:{from_line}" if from_line is not None else f"{from_file}:?"
        sys.stdout.write(f"{task_id}: OK (from {from_display} -> {expect_resolved} expect needles resolved)\n")
    return 1 if any_fail else 0


def collect_sources(directory: Path) -> list[Path]:
    """Every .py under `directory`, sorted, __pycache__ skipped."""
    found: list[Path] = []
    for entry in sorted(directory.iterdir(), key=lambda item: item.name):
        if entry.name == "__pycache__":
            continue
        if entry.is_dir():
            found.extend(collect_sources(entry))
        elif entry.is_file() and entry.suffix == ".py":
            found.append(entry)
    return found


def compiles(path: Path) -> bool:
    check = subprocess.run([sys.executable, "-m", "py_compile", str(path)], capture_output=True, text=True)
    return check.returncode == 0


def run_lint(root: Path, flags: list[str]) -> int:
    """--lint: every source file must compile, every broken fixture must not, and mypy must match the allowlist."""
    parsed = 0
    for package in PACKAGES:
        base = root / package
        if not base.is_dir():
            sys.stdout.write(f"lint: FAIL (missing {base})\n")
            return 1
        for path in collect_sources(base):
            if not compiles(path):
                sys.stdout.write(f"lint: FAIL ({path} does not compile)\n")
                return 1
            parsed += 1
    sys.stdout.write(f"lint: OK ({parsed} source file(s) compile)\n")

    fixtures = root / "fixtures" / "broken-syntax"
    if not fixtures.is_dir():
        sys.stdout.write(f"lint: FAIL (missing {fixtures})\n")
        return 1
    refused = 0
    for entry in sorted(fixtures.iterdir(), key=lambda item: item.name):
        if entry.suffix != ".py" or not entry.is_file():
            continue
        if compiles(entry):
            sys.stdout.write(f"lint: FAIL ({entry} compiled; it must not)\n")
            return 1
        refused += 1
    sys.stdout.write(f"lint: OK ({refused} broken fixture(s) still refuse to compile)\n")

    return run_typecheck_gate(root, flags)


def normalise_diagnostics(stdout: str) -> list[str]:
    """`path:line:col: error: msg  [code]` -> `path: error: msg  [code]`, sorted."""
    lines = []
    for line in stdout.splitlines():
        if ": error:" not in line:
            continue
        lines.append(re.sub(r":\d+(:\d+)?: error:", ": error:", line, count=1))
    return sorted(lines)


def multiset_difference(left: list[str], right: list[str]) -> list[str]:
    remaining: dict[str, int] = {}
    for line in right:
        remaining[line] = remaining.get(line, 0) + 1
    extra = []
    for line in left:
        if remaining.get(line, 0) > 0:
            remaining[line] -= 1
        else:
            extra.append(line)
    return extra


def run_typecheck_gate(root: Path, flags: list[str]) -> int:
    """
    mypy gate (HARD): mypy is an exact-pinned dev dependency (requirements-dev.txt).
    Diagnostics are normalised (line/column stripped) and compared as a multiset
    against bench/mypy-allowlist.txt; NEW and GONE diagnostics both fail.
    """
    check = subprocess.run(
        [sys.executable, "-m", "mypy", "--config-file", "mypy.ini", *PACKAGES],
        cwd=root,
        capture_output=True,
        text=True,
        env={**os.environ, "MYPY_CACHE_DIR": str(root / ".mypy_cache")},
    )
    if "No module named mypy" in check.stderr:
        sys.stdout.write("lint: FAIL (mypy not importable; pip install -r requirements-dev.txt)\n")
        return 1
    actual = normalise_diagnostics(check.stdout)
    allowlist = root / "bench" / "mypy-allowlist.txt"
    if "--write-allowlist" in flags:
        allowlist.write_text("".join(line + "\n" for line in actual), encoding="utf-8")
        sys.stdout.write(f"lint: WROTE {allowlist} ({len(actual)} diagnostic(s))\n")
        return 0
    expected = [line for line in allowlist.read_text(encoding="utf-8").splitlines() if line] if allowlist.is_file() else []
    extra = multiset_difference(actual, expected)
    stale = multiset_difference(expected, actual)
    if extra or stale:
        for line in extra:
            sys.stdout.write(f"lint: NEW  {line}\n")
        for line in stale:
            sys.stdout.write(f"lint: GONE {line}\n")
        sys.stdout.write(
            f"lint: FAIL (mypy: {len(extra)} diagnostic(s) not in bench/mypy-allowlist.txt, {len(stale)} allowlisted diagnostic(s) no longer occur)\n"
        )
        return 1
    sys.stdout.write(f"lint: OK (mypy: {len(actual)} diagnostic(s), all allowlisted)\n")
    return 0


def main() -> int:
    flags = sys.argv[1:]
    root = resolve_root(flags)
    if "--lint" in flags:
        return run_lint(root, flags)
    return run_tasks(root)


if __name__ == "__main__":
    sys.exit(main())
