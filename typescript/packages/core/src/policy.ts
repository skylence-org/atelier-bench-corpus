/** Authorisation rules. */

import type { RepairOrder } from "./models/repairOrder";
import { RepairStatus } from "./support/status";

/** Who is asking. */
export type Actor =
    | { readonly role: "customer"; readonly id: number }
    | { readonly role: "technician"; readonly id: number }
    | { readonly role: "manager" };

/** Gate around {@link RepairOrder} mutations. */
export class RepairOrderPolicy {
    /** Customers see only their own orders; staff see everything. */
    canView(actor: Actor, order: RepairOrder): boolean {
        return actor.role === "customer" ? actor.id === order.customerId : true;
    }

    /** Only staff move an order forward, and never past a terminal state. */
    canTransition(actor: Actor, order: RepairOrder): boolean {
        if (RepairStatus.isTerminal(order.status)) {
            return false;
        }

        return actor.role !== "customer";
    }

    /** Collection is signed off by the owning customer or a manager. */
    canCollect(actor: Actor, order: RepairOrder): boolean {
        if (order.status !== RepairStatus.Completed) {
            return false;
        }

        switch (actor.role) {
            case "customer":
                return actor.id === order.customerId;
            case "manager":
                return true;
            case "technician":
                return false;
        }
    }
}
