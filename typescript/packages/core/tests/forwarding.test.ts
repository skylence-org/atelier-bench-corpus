import { describe, expect, it } from "vitest";

import { makeTechnician } from "@atelier/core";

describe("proxy forwarding", () => {
    it("exposes schedule methods with no declaration on the owner", () => {
        const technician = makeTechnician(1, "Ada");

        expect(technician.nextSlot()).toBe(0);
        expect(technician.bookSlot(0)).toBe(true);
        expect(technician.nextSlot()).toBe(1);
        expect(technician.bookedCount()).toBe(1);
    });

    it("keeps the owner's own members", () => {
        const technician = makeTechnician(2, "Rik");

        expect(technician.name).toBe("Rik");
        expect(technician.utilisation()).toBe(0);
    });
});
