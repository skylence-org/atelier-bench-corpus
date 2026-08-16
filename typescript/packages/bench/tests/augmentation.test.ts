import { describe, expect, it } from "vitest";

import "@atelier/bench/augmentations";
import { Formatter } from "@atelier/core/billing";

describe("module augmentation", () => {
    it("adds a method declared in another package", () => {
        expect(new Formatter("EUR").debugLabel()).toBe("billing-formatter(money)");
    });
});
