import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Dispatcher, REPAIR_COMPLETED, SendCompletionNotice, channelFor } from "@atelier/core";
import { AuditingDeviceObserver, Device } from "@atelier/core";

describe("string-keyed events", () => {
    it("connects emit to on through the literal name only", () => {
        const dispatcher = new Dispatcher();
        const listener = new SendCompletionNotice().subscribe(dispatcher);

        dispatcher.dispatch(REPAIR_COMPLETED, { orderId: 1, reference: "AT-2026-000001" });
        dispatcher.dispatch("stock.depleted", { sku: "BAT-55" });

        assert.equal(listener.sent, 1);
        assert.equal(listener.last, "AT-2026-000001");
        assert.deepEqual(dispatcher.seen, ["repair.completed", "stock.depleted"]);
        assert.deepEqual(dispatcher.listenerNames(), ["repair.completed"]);
    });

    it("routes each event to a channel", () => {
        assert.equal(channelFor("repair.completed", { orderId: 4 }), "orders.4");
        assert.equal(channelFor("stock.depleted", { sku: "BAT-55" }), "inventory");
    });

    it("records observer lines for a device", () => {
        const observer = new AuditingDeviceObserver();
        const device = new Device(1, 1, "Apple", "MBP 14");

        observer.created(device);
        observer.deleted(device);

        assert.deepEqual(observer.lines, ["device.created Apple MBP 14", "device.deleted Apple MBP 14"]);
    });
});
