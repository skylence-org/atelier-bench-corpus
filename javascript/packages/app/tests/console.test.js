import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { seededState } from "@atelier/app";
import { DEFAULT_PORT, parseCommand } from "@atelier/app/commands/index.js";
import { exportReport } from "@atelier/app/commands/exportReport.js";
import { recalculateInventory } from "@atelier/app/commands/recalculateInventory.js";
import { metricLines, ruleLine, summarize } from "@atelier/app/seed.js";

describe("console surface", () => {
    it("parses every subcommand", () => {
        assert.deepEqual(parseCommand(["serve"]), { kind: "serve", port: DEFAULT_PORT });
        assert.deepEqual(parseCommand(["serve", "9000"]), { kind: "serve", port: 9000 });
        assert.deepEqual(parseCommand(["seed"]), { kind: "seed" });
        assert.deepEqual(parseCommand(["report", "part-usage"]), { kind: "report", slug: "part-usage" });
        assert.deepEqual(parseCommand(["nonsense"]), { kind: "help" });
    });

    it("announces depleted parts from the inventory job", async () => {
        assert.equal(await recalculateInventory(seededState()), "recalculated 1 part(s)");
    });

    it("renders a registered report through createRequire", () => {
        const state = seededState();

        assert.match(exportReport(state, "gross-profit"), /gross profit,120\.25/);
        assert.match(exportReport(state, "gross-profit", "json"), /"cents":12025/);
        assert.throws(() => exportReport(state, "nope"), /unknown report/);
        assert.throws(() => exportReport(state, "gross-profit", "pdf"), /unknown export format/);
    });

    it("reports the frozen seed numbers", () => {
        const state = seededState();

        assert.equal(summarize(state), "seeded: 3 customer(s), 4 order(s), 4 part(s), revenue 58325c");
        assert.equal(metricLines(state).length, 16);
        assert.equal(ruleLine(state), "rules: 48/48 satisfied");
    });
});
