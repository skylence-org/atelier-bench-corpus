import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BOARD_REFRESH, SlotBoard } from "@atelier/core/support/slotBoard.js";
import SlotWindow from "@atelier/core/support/slotWindow.js";
import { refTag } from "@atelier/core/support/referenceTag.js";
import * as glob from "@atelier/core/support/helpersGlob.js";
import { BOARD_REF_PREFIX, summariseDay } from "@atelier/core/support/boardSummary.js";

describe("slot board", () => {
    it("drops out-of-range slots and orders the rest", () => {
        const board = new SlotBoard("Nel", 4, [3, 9, 0, -1]);

        assert.deepEqual(board.booked, [0, 3]);
    });

    it("reaches the computed method through the exported key", () => {
        const board = new SlotBoard("Rik", 4);

        assert.equal(BOARD_REFRESH, "refresh");
        assert.deepEqual(board[BOARD_REFRESH]([2, 1]).booked, [1, 2]);
    });

    it("keeps `this` in the class-field arrow when it is detached", () => {
        const board = new SlotBoard("Sam", 4, [0, 1]);
        const detached = board.describe;

        assert.equal(detached(), "Sam: 2/4");
        assert.ok(!Object.hasOwn(SlotBoard.prototype, "describe"));
    });

    it("exposes load through the defineProperty accessor only", () => {
        const board = new SlotBoard("Nel", 4, [0, 1, 2]);

        assert.equal(board.load, 0.75);
        assert.equal(new SlotBoard("Nel", 0).load, 0);
        assert.ok(Object.hasOwn(SlotBoard.prototype, "load"));
        assert.equal(typeof Object.getOwnPropertyDescriptor(SlotBoard.prototype, "load")?.get, "function");
    });
});

describe("slot window", () => {
    it("coerces through the symbol-keyed method", () => {
        const span = new SlotWindow(2, 3);

        assert.equal(`${span}`, "2-4");
        assert.equal(Number(span), 3);
    });
});

describe("tagged template", () => {
    it("renders every interpolated value", () => {
        assert.equal(refTag`slot ${1} of ${4}`, "slot 1 of 4");
        assert.equal(refTag`no values`, "no values");
    });
});

describe("glob re-export", () => {
    it("forwards every export of helpers.js", () => {
        assert.deepEqual(Object.keys(glob).sort(), [
            "ATELIER_REF_PREFIX",
            "ATELIER_REF_WIDTH",
            "atelierFormatReference",
            "atelierParseReference",
        ]);
        assert.equal(glob.atelierFormatReference("AT", 1), "AT-2026-000001");
    });
});

describe("day summary", () => {
    it("joins the board, the window, the tag and the glob", () => {
        const summary = summariseDay("Nel", 7, 4, [1, 0, 2]);

        assert.equal(BOARD_REF_PREFIX, "TB");
        assert.equal(summary.reference, "TB-2026-000007");
        assert.equal(summary.caption, "board TB-2026-000007 holds 3 of 4");
        assert.equal(summary.load, 0.75);
        assert.equal(summary.window, "0-2");
        assert.equal(summary.windowLength, 3);
    });
});
