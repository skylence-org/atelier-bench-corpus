/** The central aggregate. */

import { withReference } from "../concerns/hasReference";
import type { Container } from "../container";
import { IllegalTransitionError } from "../errors";
import { Money } from "../money";
import type { Part } from "./part";
import { Priority } from "../support/priority";
import { RepairStatus } from "../support/status";

/** One part line on an order. */
export interface OrderPart {
    readonly partId: number;
    readonly sku: string;
    readonly quantity: number;
    readonly unitPrice: Money;
}

/** Append-only lifecycle entry. */
export interface StatusChange {
    readonly from: RepairStatus;
    readonly to: RepairStatus;
    readonly changedBy: string;
}

class RepairOrderBase {
    status: RepairStatus = RepairStatus.Received;
    priority: Priority = Priority.Standard;
    laborMinutes = 0;
    readonly parts: OrderPart[] = [];
    readonly log: StatusChange[] = [];

    constructor(
        readonly id: number,
        readonly customerId: number,
        readonly deviceId: number,
    ) {}
}

/** A repair job: device in, invoice out. */
export class RepairOrder extends withReference(RepairOrderBase) {
    /** Move to `next` when the lifecycle allows it, logging the change. */
    transitionTo(next: RepairStatus, changedBy: string): boolean {
        if (!RepairStatus.transitionsTo(this.status).includes(next)) {
            return false;
        }

        this.log.push({ from: this.status, to: next, changedBy });
        this.status = next;

        return true;
    }

    /** Drive the order to Completed, throwing on an illegal jump. */
    complete(changedBy: string): void {
        if (!this.transitionTo(RepairStatus.Completed, changedBy)) {
            throw new IllegalTransitionError(this.status, RepairStatus.Completed);
        }
    }

    /** Parts-only subtotal; labour is the calculator's business. */
    partsSubtotal(): Money {
        return Money.sum(this.parts.map((line) => line.unitPrice.times(line.quantity)));
    }

    /** Total through the bound strategy: the concrete class is the container's choice. */
    total(container: Container): Money {
        return container.invoiceCalculator().calculate(this);
    }

    /** Attach a part line, priced from the stock record. */
    addPart(part: Part, quantity: number): void {
        this.parts.push({ partId: part.id, sku: part.sku, quantity, unitPrice: part.unitPrice });
    }

    isOpen(): boolean {
        return RepairStatus.isOpen(this.status);
    }

    static seed(id: number, customerId: number, deviceId: number): RepairOrder {
        const order = new RepairOrder(id, customerId, deviceId);
        order.referenceNumber = id;

        return order;
    }
}
