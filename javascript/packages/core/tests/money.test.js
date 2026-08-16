import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Money } from "@atelier/core";

describe("money", () => {
    it("keeps cents behind a private field", () => {
        const amount = new Money(1234);

        assert.equal(amount.cents, 1234);
        assert.equal(amount.euros, 12);
        assert.equal(amount.toString(), "12.34");
        assert.ok(!Object.hasOwn(amount, "cents"));
    });

    it("builds its zero in a static block", () => {
        assert.equal(Money.ZERO.cents, 0);
        assert.ok(Money.ZERO.isZero());
        assert.equal(Money.sum([new Money(100), new Money(25)]).cents, 125);
    });

    it("applies a basis-point surcharge the same way every lane does", () => {
        assert.equal(new Money(23425).withSurchargeBp(2500).cents, 29281);
        assert.equal(new Money(34900).withSurchargeBp(0).cents, 34900);
    });

    it("parses and refuses malformed input", () => {
        assert.equal(Money.parse("12.34").cents, 1234);
        assert.equal(Money.fromCents(5).cents, 5);
        assert.throws(() => Money.parse("12.345"), TypeError);
    });
});
