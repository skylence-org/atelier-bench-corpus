import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Schedule, makeTechnician } from "@atelier/core";

describe("proxy forwarding", () => {
    it("resolves a method the owner never declares", () => {
        const technician = makeTechnician(1, "Nel");

        assert.equal(technician.name, "Nel");
        assert.equal(technician.nextSlot(), 0);
        assert.ok(technician.bookSlot(0));
        assert.equal(technician.nextSlot(), 1);
        assert.equal(technician.bookedCount(), 1);
    });

    it("keeps the forwarded method bound to the schedule", () => {
        const schedule = new Schedule(2);
        const technician = makeTechnician(2, "Rik", schedule);

        technician.bookSlot(0);
        technician.bookSlot(1);

        assert.equal(schedule.bookedCount(), 2);
        assert.equal(technician.nextSlot(), undefined);
        assert.equal(technician.utilisation(), 1);
        assert.ok("nextSlot" in technician);
    });

    it("guards the capacity setter against dropping booked slots", () => {
        const schedule = new Schedule(4);
        schedule.bookSlot(0);
        schedule.bookSlot(1);
        schedule.capacity = 1;

        assert.equal(schedule.capacity, 2);
    });
});
