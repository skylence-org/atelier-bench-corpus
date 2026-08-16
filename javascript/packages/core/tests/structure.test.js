import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { TreeNode, atelierFormatReference, atelierParseReference } from "@atelier/core";
import { Left, Right } from "@atelier/core/support/pair.js";

describe("self-referential nodes", () => {
    it("nests nodes of its own type", () => {
        const root = new TreeNode("atelier");
        const bench = root.addChild(new TreeNode("bench"));
        bench.addChild(new TreeNode("slot-1"));

        assert.equal(root.depth(), 0);
        assert.equal(bench.depth(), 1);
        assert.equal(bench.parent, root);
        assert.equal(root.flatten().length, 3);
    });
});

describe("sibling pair", () => {
    it("keeps the two branches distinct", () => {
        const failure = Left.of("body", "must not be empty");
        const success = Right.of(42);

        assert.ok(failure.isLeft());
        assert.ok(!success.isLeft());
        assert.equal(failure.reason, "must not be empty");
        assert.equal(success.value, 42);
    });
});

describe("reference helpers", () => {
    it("formats and parses the corpus reference", () => {
        assert.equal(atelierFormatReference("AT", 1), "AT-2026-000001");
        assert.deepEqual(atelierParseReference("AT-2026-000123"), { prefix: "AT", year: 2026, num: 123 });
    });
});
