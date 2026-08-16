import { describe, expect, it } from "vitest";

import { Money } from "@atelier/core";

describe("money", () => {
    it("rounds a basis-point surcharge half up", () => {
        expect(new Money(10000).withSurchargeBp(2500).cents).toBe(12500);
    });

    it("parses and renders", () => {
        expect(Money.parse("12.34").cents).toBe(1234);
        expect(new Money(1234).toString()).toBe("12.34");
    });

    it("rejects a malformed value", () => {
        expect(() => Money.parse("12.345")).toThrow(TypeError);
    });

    it("sums through the merged namespace", () => {
        expect(Money.sum([new Money(100), new Money(250)]).cents).toBe(350);
        expect(Money.ZERO.isZero()).toBe(true);
    });
});
