import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Money, RepairStatus } from "@atelier/core";
import { Formatter as MoneyFormatter } from "@atelier/core/billing";
import { Formatter as StatusFormatter } from "@atelier/core/reporting";

describe("shadow pair", () => {
    it("keeps two same-name classes apart behind aliases", () => {
        const money = new MoneyFormatter("EUR");
        const status = new StatusFormatter("en");

        assert.notEqual(money.constructor, status.constructor);
        assert.equal(money.money(new Money(34900)), "349.00 EUR");
        assert.equal(money.line(2, "Battery", new Money(17800)), "2 x Battery = 178.00 EUR");
        assert.equal(status.statusLine(RepairStatus.Completed, "intake"), "Completed since intake");
        assert.equal(status.localeTag(), "en");
    });

    it("exposes neither half through the barrel", async () => {
        const barrel = await import("@atelier/core");

        assert.equal(barrel.Formatter, undefined);
    });
});
