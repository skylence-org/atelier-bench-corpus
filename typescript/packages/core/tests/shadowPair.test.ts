import { describe, expect, it } from "vitest";

import { Formatter as MoneyFormatter } from "@atelier/core/billing";
import { Formatter as StatusFormatter } from "@atelier/core/reporting";
import { Money, RepairStatus } from "@atelier/core";

describe("same-name Formatter pair", () => {
    it("resolves the billing half through its alias", () => {
        expect(new MoneyFormatter("EUR").money(new Money(1234))).toBe("12.34 EUR");
    });

    it("resolves the reporting half through its alias", () => {
        expect(new StatusFormatter("en").statusLine(RepairStatus.AwaitingParts, "Monday")).toBe(
            "Awaiting parts since Monday",
        );
    });
});
