import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
    Container,
    IllegalTransitionError,
    Money,
    Part,
    RepairOrder,
    RepairOrderPolicy,
    RepairStatus,
} from "@atelier/core";

describe("repair order lifecycle", () => {
    it("walks the allowed transitions and refuses the rest", () => {
        const order = RepairOrder.seed(1, 1, 1);

        assert.ok(order.transitionTo(RepairStatus.Diagnosing, "seeder"));
        assert.ok(!order.transitionTo(RepairStatus.Collected, "seeder"));
        assert.ok(order.transitionTo(RepairStatus.Repairing, "seeder"));
        assert.ok(order.isOpen());
        order.complete("seeder");
        assert.equal(order.status, RepairStatus.Completed);
        assert.equal(order.log.length, 3);
        assert.ok(!order.isOpen());
    });

    it("throws on an illegal completion", () => {
        const order = RepairOrder.seed(2, 1, 1);

        assert.throws(() => order.complete("seeder"), IllegalTransitionError);
    });

    it("gets reference() from the mixin, not from the model file", () => {
        const order = RepairOrder.seed(1, 1, 1);

        assert.equal(order.reference(), "AT-2026-000001");
        assert.equal(order.shortReference(), "AT1");
        assert.ok(!Object.hasOwn(RepairOrder.prototype, "constructorOnlyMarker"));
    });

    it("totals through the container binding", () => {
        const order = RepairOrder.seed(1, 1, 1);
        order.laborMinutes = 120;
        order.addPart(new Part(1, "SCR-13", 'Screen 13"', new Money(19900), 4), 1);

        assert.equal(order.partsSubtotal().cents, 19900);
        assert.equal(order.total(Container.bindDefault()).cents, 34900);
        assert.equal(Container.bindRush().invoiceCalculator().name, "rush");
    });

    it("gates transitions behind the policy", () => {
        const order = RepairOrder.seed(3, 7, 1);
        const policy = new RepairOrderPolicy();

        assert.ok(policy.canView({ role: "customer", id: 7 }, order));
        assert.ok(!policy.canView({ role: "customer", id: 8 }, order));
        assert.ok(policy.canTransition({ role: "manager" }, order));
        assert.ok(!policy.canTransition({ role: "customer", id: 7 }, order));
        assert.ok(!policy.canCollect({ role: "manager" }, order));
    });
});
