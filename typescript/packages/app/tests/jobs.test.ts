import { describe, expect, it } from "vitest";

import { Dataset } from "@atelier/bench";
import { Dispatcher } from "@atelier/core";
import { RecalculateInventory, recalculateInventory } from "@atelier/app/jobs";

describe("inventory job", () => {
    it("hands the announced count to a node-style callback", () => {
        const seen: Array<[Error | null, number]> = [];

        recalculateInventory(Dataset.seeded(), new Dispatcher(), (error, count) => {
            seen.push([error, count]);
        });

        expect(seen).toEqual([[null, 1]]);
    });

    it("returns the same count through the class form", () => {
        expect(new RecalculateInventory().run(Dataset.seeded(), new Dispatcher())).toBe(1);
    });
});
