#!/usr/bin/env node
// Cross-lane task matrix + verifier conformance check.
//
//   node bench/check-matrix.mjs            # verify bench/matrix.json matches reality; exit 0/1
//   node bench/check-matrix.mjs --write    # regenerate bench/matrix.json from the lanes (the
//                                           # only way to add a canonical id)
//
// Node built-ins only, run from the repository root. CI runs the default (read-only) mode.
//
// 1. For each lane in matrix.json's `lanes`, runs its verifier from the lane directory and
//    requires exit 0.
// 2. Cross-checks the ids each verifier reported against that lane's bench/tasks.json, then
//    builds {lane -> {id -> surface}} straight from tasks.json.
// 3. Asserts every task id is listed in matrix.canonical, every canonical entry's `lanes` array
//    matches reality, and any id shared by two or more lanes carries the same `surface` in each.
// 4. Runs every lane verifier against bench/conformance/ (via --root) and diffs stdout against
//    bench/conformance/expected.txt byte for byte.
// 5. Prints a coverage grid and `matrix: OK (<n> canonical ids, <m> lanes)`, or the first
//    violation, and exits accordingly.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import process from "node:process";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MATRIX_PATH = join(REPO_ROOT, "bench", "matrix.json");
const CONFORMANCE_DIR = join(REPO_ROOT, "bench", "conformance");
const EXPECTED_PATH = join(CONFORMANCE_DIR, "expected.txt");

// Known lane verify commands. A lane is included only when its directory carries
// bench/tasks.json on disk -- a lane that does not exist yet is simply omitted (issue #5).
const LANE_DEFS = [
    { name: "php", verify: ["php", "bench/verify_tasks.php"] },
    { name: "rust", verify: ["cargo", "run", "-q", "-p", "bench-verify"] },
    { name: "typescript", verify: ["node", "bench/verify-tasks/verify.mjs"] },
    { name: "javascript", verify: ["node", "bench/verify-tasks/verify.mjs"] },
];

const write = process.argv.slice(2).includes("--write");

process.exit(write ? runWrite() : runCheck());

function runWrite() {
    const lanes = presentLanes();

    for (const lane of lanes) {
        const result = runVerifier(lane);
        if (!verifierPassed(result)) {
            return fail(`${lane.name} verifier exited ${exitDescription(result)}`);
        }
    }

    const built = buildMatrix(lanes);
    if (built.conflicts.length > 0) {
        return fail(built.conflicts[0]);
    }

    writeFileSync(MATRIX_PATH, serialize(built.matrix));

    const conformanceCode = runConformance(lanes);
    if (conformanceCode !== 0) {
        return conformanceCode;
    }

    printGrid(built.matrix);
    report(built.matrix);
    return 0;
}

function runCheck() {
    if (!existsSync(MATRIX_PATH)) {
        return fail("bench/matrix.json missing (run --write)");
    }

    const committed = JSON.parse(readFileSync(MATRIX_PATH, "utf8"));
    const lanes = Object.keys(committed.lanes).map((name) => {
        const known = LANE_DEFS.find((lane) => lane.name === name);
        return known ?? { name, verify: committed.lanes[name].verify };
    });

    for (const lane of lanes) {
        const manifestPath = join(REPO_ROOT, lane.name, "bench", "tasks.json");
        if (!existsSync(manifestPath)) {
            return fail(`lane ${lane.name} is in matrix.json but ${lane.name}/bench/tasks.json is missing`);
        }

        const result = runVerifier(lane);
        if (!verifierPassed(result)) {
            return fail(`${lane.name} verifier exited ${exitDescription(result)}`);
        }

        const reportedIds = parseReportedIds(result.stdout ?? "");
        const taskIds = new Set(readLaneTasks(lane).keys());
        for (const id of reportedIds) {
            if (!taskIds.has(id)) {
                return fail(`${lane.name} verifier reported ${id}, which is not in ${lane.name}/bench/tasks.json`);
            }
        }
        for (const id of taskIds) {
            if (!reportedIds.has(id)) {
                return fail(`${lane.name}/bench/tasks.json has ${id}, but the verifier never reported it`);
            }
        }
    }

    const built = buildMatrix(lanes);
    if (built.conflicts.length > 0) {
        return fail(built.conflicts[0]);
    }

    for (const [id, entry] of Object.entries(built.matrix.canonical)) {
        const committedEntry = committed.canonical[id];
        if (!committedEntry) {
            return fail(`${id} is present in lane(s) ${entry.lanes.join(", ")} but missing from matrix.canonical`);
        }
        if (committedEntry.surface !== entry.surface) {
            return fail(`${id} surface mismatch: matrix.json says "${committedEntry.surface}", tasks.json says "${entry.surface}"`);
        }
        const committedLanes = [...committedEntry.lanes].sort().join(",");
        const actualLanes = [...entry.lanes].sort().join(",");
        if (committedLanes !== actualLanes) {
            return fail(`${id} lanes mismatch: matrix.json says [${committedLanes}], reality is [${actualLanes}]`);
        }
    }
    for (const id of Object.keys(committed.canonical)) {
        if (!built.matrix.canonical[id]) {
            return fail(`${id} is in matrix.canonical but no lane's tasks.json has it`);
        }
    }

    const conformanceCode = runConformance(lanes);
    if (conformanceCode !== 0) {
        return conformanceCode;
    }

    printGrid(built.matrix);
    report(built.matrix);
    return 0;
}

/** Lanes whose directory carries bench/tasks.json, in LANE_DEFS order. */
function presentLanes() {
    return LANE_DEFS.filter((lane) => existsSync(join(REPO_ROOT, lane.name, "bench", "tasks.json")));
}

/** Run one lane's verifier from its lane directory, optionally against an alternate --root. */
function runVerifier(lane, extraArgs = []) {
    const cwd = join(REPO_ROOT, lane.name);
    const [cmd, ...cmdArgs] = lane.verify;
    return spawnSync(cmd, [...cmdArgs, ...extraArgs], { cwd, encoding: "utf8" });
}

function verifierPassed(result) {
    return !result.error && result.status === 0;
}

function exitDescription(result) {
    return result.error ? `with error: ${result.error.message}` : String(result.status);
}

/** `<id>: OK` / `<id>: FAIL ...` lines -> the set of ids the verifier reported on. */
function parseReportedIds(stdout) {
    const ids = new Set();
    for (const line of stdout.split("\n")) {
        const match = /^([^\s:]+): (OK|FAIL)\b/.exec(line);
        if (match) {
            ids.add(match[1]);
        }
    }
    return ids;
}

/** One lane's bench/tasks.json -> Map<id, surface>. */
function readLaneTasks(lane) {
    const manifestPath = join(REPO_ROOT, lane.name, "bench", "tasks.json");
    const data = JSON.parse(readFileSync(manifestPath, "utf8"));
    const tasks = new Map();
    for (const task of data.tasks) {
        tasks.set(task.id, task.surface);
    }
    return tasks;
}

/**
 * Build {version, lanes, canonical} purely from each lane's tasks.json (no verifier
 * execution). Deterministic and side-effect free, so both --write and the read-only
 * check can compare against the exact same computation.
 */
function buildMatrix(lanes) {
    const laneTasks = new Map(lanes.map((lane) => [lane.name, readLaneTasks(lane)]));

    const ids = new Set();
    for (const tasks of laneTasks.values()) {
        for (const id of tasks.keys()) {
            ids.add(id);
        }
    }

    const canonical = {};
    const conflicts = [];
    for (const id of [...ids].sort()) {
        const inLanes = lanes.filter((lane) => laneTasks.get(lane.name).has(id)).map((lane) => lane.name);
        const surfaces = new Set(inLanes.map((name) => laneTasks.get(name).get(id)));
        if (surfaces.size > 1) {
            conflicts.push(`${id}: surface differs across lanes (${[...surfaces].join(", ")})`);
            continue;
        }
        canonical[id] = { surface: [...surfaces][0], lanes: inLanes };
    }

    const matrixLanes = {};
    for (const lane of lanes) {
        matrixLanes[lane.name] = { verify: lane.verify };
    }

    return { matrix: { version: 1, lanes: matrixLanes, canonical }, conflicts };
}

function serialize(matrix) {
    return `${JSON.stringify(matrix, null, 2)}\n`;
}

/** Runs every lane verifier against bench/conformance/ and diffs stdout byte for byte. */
function runConformance(lanes) {
    if (!existsSync(EXPECTED_PATH)) {
        return fail(`missing ${relative(EXPECTED_PATH)}`);
    }
    const expected = readFileSync(EXPECTED_PATH, "utf8");

    for (const lane of lanes) {
        const result = runVerifier(lane, ["--root", CONFORMANCE_DIR]);
        const actual = result.stdout ?? "";
        if (actual !== expected) {
            return fail(`conformance drift in ${lane.name}: stdout does not match ${relative(EXPECTED_PATH)} byte for byte`);
        }
    }

    return 0;
}

function relative(path) {
    return path.startsWith(`${REPO_ROOT}/`) ? path.slice(REPO_ROOT.length + 1) : path;
}

/** Coverage grid: rows = canonical ids, columns = lanes, checkmark or middle dot per cell. */
function printGrid(matrix) {
    const laneNames = Object.keys(matrix.lanes);
    const ids = Object.keys(matrix.canonical).sort();
    const idWidth = Math.max("canonical id".length, ...ids.map((id) => id.length));

    console.log(`${"canonical id".padEnd(idWidth)}  ${laneNames.join(" ")}`);
    for (const id of ids) {
        const laneSet = new Set(matrix.canonical[id].lanes);
        const row = laneNames.map((name) => (laneSet.has(name) ? "✓" : "·").padEnd(name.length)).join(" ");
        console.log(`${id.padEnd(idWidth)}  ${row}`);
    }
}

function report(matrix) {
    const idCount = Object.keys(matrix.canonical).length;
    const laneCount = Object.keys(matrix.lanes).length;
    console.log(`matrix: OK (${idCount} canonical ids, ${laneCount} lanes)`);
}

function fail(message) {
    console.error(`matrix: FAIL ${message}`);
    return 1;
}
