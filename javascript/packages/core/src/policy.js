/** Authorisation rules. */

import { RepairStatus } from "./support/status.js";

/**
 * Who is asking.
 *
 * @typedef {{ role: "customer" | "technician" | "manager", id?: number }} Actor
 */

/** Gate around repair-order mutations. */
export class RepairOrderPolicy {
    /**
     * Customers see only their own orders; staff see everything.
     *
     * @param {Actor} actor
     * @param {import("./models/repairOrder.js").RepairOrder} order
     * @returns {boolean}
     */
    canView(actor, order) {
        return actor.role === "customer" ? actor.id === order.customerId : true;
    }

    /**
     * Only staff move an order forward, and never past a terminal state.
     *
     * @param {Actor} actor
     * @param {import("./models/repairOrder.js").RepairOrder} order
     * @returns {boolean}
     */
    canTransition(actor, order) {
        if (RepairStatus.isTerminal(order.status)) {
            return false;
        }

        return actor.role !== "customer";
    }

    /**
     * Collection is signed off by the owning customer or a manager.
     *
     * @param {Actor} actor
     * @param {import("./models/repairOrder.js").RepairOrder} order
     * @returns {boolean}
     */
    canCollect(actor, order) {
        if (order.status !== RepairStatus.Completed) {
            return false;
        }

        switch (actor.role) {
            case "customer":
                return actor.id === order.customerId;
            case "manager":
                return true;
            default:
                return false;
        }
    }
}
