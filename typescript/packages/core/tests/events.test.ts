import { describe, expect, it } from "vitest";

import { REPAIR_COMPLETED, SendCompletionNotice, StringBus } from "@atelier/core";

describe("string-keyed events", () => {
    it("connects emit to on through the literal alone", () => {
        const bus = new StringBus();
        const notice = new SendCompletionNotice().subscribe(bus);

        bus.emit("repair.completed", { orderId: 4, reference: "AT-2026-000001" });
        bus.emit("stock.depleted", { sku: "SCR-001" });

        expect(notice.sent).toBe(1);
        expect(notice.last).toBe("AT-2026-000001");
        expect(bus.seen).toEqual(["repair.completed", "stock.depleted"]);
        expect(bus.subscribedNames()).toEqual(["repair.completed"]);
    });

    it("names the event with a constant that declares no symbol of its own", () => {
        expect(REPAIR_COMPLETED).toBe("repair.completed");
    });

    it("keeps the typed dispatcher path untouched", () => {
        const notice = new SendCompletionNotice();

        notice.handle({ kind: "repair_completed", orderId: 1, reference: "AT-2026-000001" });

        expect(notice.sent).toBe(1);
    });
});
