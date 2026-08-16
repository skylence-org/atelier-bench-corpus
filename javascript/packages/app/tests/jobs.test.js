import assert from "node:assert/strict";
import { describe, it } from "node:test";

import bench from "@atelier/bench";
import { Dispatcher } from "@atelier/core";

import {
    RecalculateInventory,
    recalculateInventory,
    recalculateInventoryAsync,
    recalculateInventoryPromise,
} from "@atelier/app/jobs.js";

const { Dataset } = bench;

describe("one job, three styles", () => {
    it("counts depleted parts synchronously", () => {
        const dispatcher = new Dispatcher();

        assert.equal(new RecalculateInventory().run(Dataset.seeded(), dispatcher), 1);
        assert.deepEqual(dispatcher.seen, ["stock.depleted"]);
    });

    it("hands the count to a node-style callback", (_t, done) => {
        recalculateInventory(Dataset.seeded(), new Dispatcher(), (error, count) => {
            assert.equal(error, null);
            assert.equal(count, 1);
            done();
        });
    });

    it("resolves the same count as a promise", async () => {
        assert.equal(await recalculateInventoryPromise(Dataset.seeded(), new Dispatcher()), 1);
    });

    it("awaits the console line", async () => {
        assert.equal(await recalculateInventoryAsync(Dataset.seeded(), new Dispatcher()), "recalculated 1 part(s)");
    });

    it("raises the threshold to catch more parts", () => {
        assert.equal(new RecalculateInventory(4).run(Dataset.seeded(), new Dispatcher()), 3);
    });
});
