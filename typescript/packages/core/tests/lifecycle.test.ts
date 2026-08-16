import { describe, expect, it } from "vitest";

import { Container } from "@atelier/core";
import { Money } from "@atelier/core";
import { Part } from "@atelier/core";
import { Priority } from "@atelier/core";
import { RepairOrder } from "@atelier/core";
import { RepairStatus } from "@atelier/core";

function seededOrder(): RepairOrder {
    const order = RepairOrder.seed(1, 1, 1);
    order.laborMinutes = 120;
    order.addPart(new Part(1, "SCR-13", 'Screen 13"', new Money(19900), 4), 1);

    return order;
}

describe("repair order lifecycle", () => {
    it("walks the happy path", () => {
        const order = seededOrder();

        expect(order.transitionTo(RepairStatus.Diagnosing, "seeder")).toBe(true);
        expect(order.transitionTo(RepairStatus.Repairing, "seeder")).toBe(true);
        order.complete("seeder");

        expect(order.status).toBe(RepairStatus.Completed);
        expect(order.log).toHaveLength(3);
    });

    it("refuses an illegal jump", () => {
        const order = seededOrder();

        expect(order.transitionTo(RepairStatus.Collected, "seeder")).toBe(false);
        expect(() => order.complete("seeder")).toThrow(/illegal transition/);
    });

    it("prices through the default binding", () => {
        const order = seededOrder();

        expect(order.partsSubtotal().cents).toBe(19900);
        expect(order.total(Container.bindDefault()).cents).toBe(34900);
    });

    it("prices through the rush binding", () => {
        const order = seededOrder();
        order.priority = Priority.Rush;

        expect(order.total(Container.bindRush()).cents).toBe(43625);
    });

    it("never surcharges warranty work", () => {
        const order = seededOrder();
        order.priority = Priority.Warranty;

        expect(order.total(Container.bindRush()).cents).toBe(34900);
    });

    it("formats a reference through the mixin", () => {
        expect(seededOrder().reference()).toBe("AT-2026-000001");
    });
});
