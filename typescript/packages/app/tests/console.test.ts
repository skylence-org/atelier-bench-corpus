import { describe, expect, it } from "vitest";

import { parseCommand, DEFAULT_PORT } from "@atelier/app/commands/index";
import { exportReport } from "@atelier/app/commands/exportReport";
import { recalculateInventory } from "@atelier/app/commands/recalculateInventory";
import { metricLines, summarize } from "@atelier/app/seed";
import { seededState } from "@atelier/app";

describe("console surface", () => {
    it("parses every subcommand", () => {
        expect(parseCommand(["serve"])).toEqual({ kind: "serve", port: DEFAULT_PORT });
        expect(parseCommand(["serve", "9000"])).toEqual({ kind: "serve", port: 9000 });
        expect(parseCommand(["seed"])).toEqual({ kind: "seed" });
        expect(parseCommand(["report", "part-usage"])).toEqual({ kind: "report", slug: "part-usage" });
        expect(parseCommand(["nonsense"])).toEqual({ kind: "help" });
    });

    it("announces depleted parts from the inventory job", () => {
        expect(recalculateInventory(seededState())).toBe(1);
    });

    it("renders csv for a registered report", () => {
        const state = seededState();

        expect(exportReport(state, "gross-profit")).toContain("gross profit,120.25");
        expect(() => exportReport(state, "nope")).toThrow(/unknown report/);
    });

    it("reports the frozen seed numbers", () => {
        const state = seededState();

        expect(summarize(state)).toBe("seeded: 3 customer(s), 4 order(s), 4 part(s), revenue 58325c");
        expect(metricLines(state)).toHaveLength(16);
    });
});
