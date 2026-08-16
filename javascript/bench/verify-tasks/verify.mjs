#!/usr/bin/env node
// Self-check for bench/tasks.json needle uniqueness.
//
//   node bench/verify-tasks/verify.mjs                 # resolve every file+needle pair
//   node bench/verify-tasks/verify.mjs --lint          # node --check over the lane + broken-fixture guard
//   node bench/verify-tasks/verify.mjs --root <dir>    # verify another lane-shaped directory
//
// Node built-ins only. Exit 0 only when every check passes. Mirrors
// php/bench/verify_tasks.php, rust/bench/verify-tasks/src/main.rs and
// typescript/bench/verify-tasks/verify.mjs line for line so every lane is
// scored the same way.

import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { dirname, resolve, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import process from "node:process";

const NESTED_KEYS = ["known_sites", "implementations", "known_callers", "outgoing_includes"];

/** Extensions the lint pass parses with `node --check`. */
const SOURCE_EXTENSIONS = new Set([".js", ".mjs", ".cjs"]);

const args = process.argv.slice(2);
const laneRoot = resolveRoot(args);

if (args.includes("--lint")) {
    process.exit(runLint(laneRoot));
}

process.exit(runTasks(laneRoot));

/** Lane root = the directory containing bench/, unless --root <dir> is given. */
function resolveRoot(flags) {
    const index = flags.indexOf("--root");
    if (index !== -1 && flags[index + 1]) {
        return resolve(flags[index + 1]);
    }
    return resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
}

function runTasks(root) {
    const manifestPath = join(root, "bench", "tasks.json");
    let raw;
    try {
        raw = readFileSync(manifestPath, "utf8");
    } catch {
        process.stderr.write(`FAIL: cannot read ${manifestPath}\n`);
        return 1;
    }

    let data;
    try {
        data = JSON.parse(raw);
    } catch (error) {
        process.stderr.write(`FAIL: tasks.json is not valid JSON: ${error.message}\n`);
        return 1;
    }

    if (!data || typeof data !== "object" || !Array.isArray(data.tasks)) {
        process.stderr.write("FAIL: tasks.json missing tasks array\n");
        return 1;
    }

    let anyFail = false;

    for (const task of data.tasks) {
        if (!task || typeof task !== "object" || typeof task.id !== "string") {
            process.stderr.write("FAIL: task missing id\n");
            anyFail = true;
            continue;
        }

        const id = task.id;
        const pairs = collectNeedlePairs(task);
        let fromLine = null;
        let expectResolved = 0;
        const failures = [];

        for (const pair of pairs) {
            const result = resolveNeedle(root, pair);
            if (result.ok) {
                if (pair.role === "from") {
                    fromLine = result.line;
                } else {
                    expectResolved += 1;
                }
            } else {
                failures.push(`${id}: FAIL ${pair.file} needle ${summarize(pair.needle)} (${result.reason})`);
            }
        }

        if (failures.length > 0) {
            anyFail = true;
            for (const failure of failures) {
                process.stdout.write(`${failure}\n`);
            }
            continue;
        }

        const fromFile = task.from && typeof task.from === "object" && typeof task.from.file === "string"
            ? task.from.file
            : "?";
        const fromDisplay = fromLine !== null ? `${fromFile}:${fromLine}` : `${fromFile}:?`;
        process.stdout.write(`${id}: OK (from ${fromDisplay} -> ${expectResolved} expect needles resolved)\n`);
    }

    return anyFail ? 1 : 0;
}

/** Resolve one pair to its unique 1-based line, or explain why it did not. */
function resolveNeedle(root, pair) {
    const path = join(root, pair.file);
    if (!existsSync(path) || !statSync(path).isFile()) {
        return { ok: false, reason: "file missing" };
    }

    let content;
    try {
        content = readFileSync(path, "utf8");
    } catch {
        return { ok: false, reason: "unreadable" };
    }

    const lines = content.split(/\r\n|\n|\r/);
    const hits = [];
    lines.forEach((line, index) => {
        if (line.includes(pair.needle)) {
            hits.push(index + 1);
        }
    });

    if (hits.length !== 1) {
        return { ok: false, reason: `found ${hits.length} times` };
    }

    return { ok: true, line: hits[0] };
}

/** Every {file, needle} pair a task carries, in document order. Roles: "from" | "expect". */
function collectNeedlePairs(task) {
    const pairs = [];

    if (isFileNeedle(task.from)) {
        pairs.push({ file: task.from.file, needle: task.from.needle, role: "from" });
    }

    const expect = task.expect;
    if (!expect || typeof expect !== "object") {
        return pairs;
    }

    if (isFileNeedle(expect)) {
        pairs.push({ file: expect.file, needle: expect.needle, role: "expect" });
    }

    for (const key of NESTED_KEYS) {
        if (!Array.isArray(expect[key])) {
            continue;
        }
        for (const item of expect[key]) {
            if (isFileNeedle(item)) {
                pairs.push({ file: item.file, needle: item.needle, role: "expect" });
            }
        }
    }

    if (isFileNeedle(expect.candidate)) {
        pairs.push({ file: expect.candidate.file, needle: expect.candidate.needle, role: "expect" });
    }

    // Non-needle expect keys (contains, behavior, must_include, must_not_include,
    // min_*, exact_count, kind, resolution) are ignored by design.
    return pairs;
}

function isFileNeedle(value) {
    return Boolean(value)
        && typeof value === "object"
        && typeof value.file === "string"
        && typeof value.needle === "string";
}

function summarize(needle) {
    const chars = Array.from(needle);
    if (chars.length <= 80) {
        return needle;
    }
    return `${chars.slice(0, 77).join("")}...`;
}

/**
 * --lint: every source file must parse, and every broken fixture must still
 * refuse to parse. `npx tsc -p jsconfig.json` runs on top when a local
 * typescript is installed; it is an optional gate, never a hard dependency.
 */
function runLint(root) {
    const packages = join(root, "packages");
    if (!existsSync(packages) || !statSync(packages).isDirectory()) {
        process.stdout.write(`lint: FAIL (missing ${packages})\n`);
        return 1;
    }

    let parsed = 0;
    for (const file of collectSources(packages)) {
        const check = spawnSync(process.execPath, ["--check", file], { cwd: root, encoding: "utf8" });
        if (check.error) {
            process.stdout.write(`lint: FAIL (node not runnable: ${check.error.message})\n`);
            return 1;
        }
        if (check.status !== 0) {
            process.stdout.write(`lint: FAIL (${file} does not parse)\n${check.stderr}`);
            return 1;
        }
        parsed += 1;
    }
    process.stdout.write(`lint: OK (${parsed} source file(s) parse)\n`);

    const fixtures = join(root, "fixtures", "broken-syntax");
    if (!existsSync(fixtures) || !statSync(fixtures).isDirectory()) {
        process.stdout.write(`lint: FAIL (missing ${fixtures})\n`);
        return 1;
    }

    let refused = 0;
    for (const entry of readdirSync(fixtures).sort()) {
        const path = join(fixtures, entry);
        if (!SOURCE_EXTENSIONS.has(extname(entry)) || !statSync(path).isFile()) {
            continue;
        }
        const check = spawnSync(process.execPath, ["--check", path], { cwd: root, encoding: "utf8" });
        if (check.error) {
            process.stdout.write(`lint: FAIL (node not runnable: ${check.error.message})\n`);
            return 1;
        }
        if (check.status === 0) {
            process.stdout.write(`lint: FAIL (${path} parsed; it must not)\n`);
            return 1;
        }
        refused += 1;
    }
    process.stdout.write(`lint: OK (${refused} broken fixture(s) still refuse to parse)\n`);

    return runOptionalTypecheck(root);
}

/** Every .js/.mjs/.cjs under `dir`, depth first, node_modules skipped. */
function collectSources(dir) {
    const found = [];

    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (entry.name === "node_modules") {
            continue;
        }

        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            found.push(...collectSources(path));
        } else if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name))) {
            found.push(path);
        }
    }

    return found;
}

/**
 * JSDoc typecheck over jsconfig.json, only when a local typescript is present.
 *
 * ADVISORY, never fatal. The lane ships no typescript and no @types packages
 * (express + supertest are its only dependencies), and its whole point is
 * behaviour tsc cannot model: Object.assign mixins, Proxy forwarding, prototype
 * assignment. Diagnostics here describe the JSDoc surface, they are not a
 * defect in the lane, so they are reported and the exit code stays 0.
 */
function runOptionalTypecheck(root) {
    const tsc = join(root, "node_modules", ".bin", process.platform === "win32" ? "tsc.cmd" : "tsc");
    if (!existsSync(tsc)) {
        process.stdout.write("lint: SKIP (no local typescript; jsconfig.json checkJs pass not run)\n");
        return 0;
    }

    const check = spawnSync(tsc, ["-p", "jsconfig.json"], { cwd: root, encoding: "utf8" });
    if (check.error) {
        process.stdout.write(`lint: ADVISORY (tsc not runnable: ${check.error.message})\n`);
        return 0;
    }
    if (check.status !== 0) {
        const count = `${check.stdout}`.split("\n").filter((line) => line.includes(": error TS")).length;
        process.stdout.write(
            `lint: ADVISORY (tsc -p jsconfig.json reported ${count} diagnostic(s); see javascript/README.md)\n`,
        );
        return 0;
    }

    process.stdout.write("lint: OK (tsc -p jsconfig.json)\n");
    return 0;
}
