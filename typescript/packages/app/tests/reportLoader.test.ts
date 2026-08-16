import { describe, expect, it } from "vitest";

import { seededState } from "@atelier/app";

import { collectOpenReferences, describeOrder, iterateOpenOrders, loadOrder } from "../src/http/reportLoader";
import { toLegacyMoney } from "../src/http/legacy";

describe("async surface", () => {
    it("awaits the async loader", async () => {
        const state = seededState();
        expect((await loadOrder(state, "AT-2026-000001"))?.reference()).toBe("AT-2026-000001");
        expect(await describeOrder(state, "AT-2026-999999")).toBeNull();
    });

    it("iterates the generator and streams the async generator", async () => {
        const state = seededState();
        const viaGenerator = [...iterateOpenOrders(state)].map((order) => order.reference());
        const viaStream = await collectOpenReferences(state);

        expect(viaStream).toEqual(viaGenerator);
        expect(viaStream.length).toBe(state.data.openOrders().length);
    });

    it("types against the ambient module declaration", () => {
        expect(toLegacyMoney(4500)).toEqual({ cents: 4500, currency: "EUR" });
    });
});
