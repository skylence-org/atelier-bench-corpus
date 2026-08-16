/** The central aggregate. */

import { withReference } from "../concerns/hasReference.js";
import { IllegalTransitionError } from "../errors.js";
import { Money } from "../money.js";
import { RepairStatus } from "../support/status.js";

/**
 * One part line on an order.
 *
 * @typedef {object} OrderPart
 * @property {number} partId
 * @property {string} sku
 * @property {number} quantity
 * @property {Money} unitPrice
 */

/**
 * Append-only lifecycle entry.
 *
 * @typedef {object} StatusChange
 * @property {import("../support/status.js").RepairStatusValue} from
 * @property {import("../support/status.js").RepairStatusValue} to
 * @property {string} changedBy
 */

/** A repair job: device in, invoice out. */
export class RepairOrder {
    /**
     * @param {number} id
     * @param {number} customerId
     * @param {number} deviceId
     */
    constructor(id, customerId, deviceId) {
        this.id = id;
        this.customerId = customerId;
        this.deviceId = deviceId;

        /** @type {import("../support/status.js").RepairStatusValue} */
        this.status = RepairStatus.Received;

        /** @type {import("../support/priority.js").PriorityValue} */
        this.priority = "standard";

        this.laborMinutes = 0;

        /** @type {OrderPart[]} */
        this.parts = [];

        /** @type {StatusChange[]} */
        this.log = [];
    }

    /**
     * Move to `next` when the lifecycle allows it, logging the change.
     *
     * @param {import("../support/status.js").RepairStatusValue} next
     * @param {string} changedBy
     * @returns {boolean}
     */
    transitionTo(next, changedBy) {
        if (!RepairStatus.transitionsTo(this.status).includes(next)) {
            return false;
        }

        this.log.push({ from: this.status, to: next, changedBy });
        this.status = next;

        return true;
    }

    /**
     * Drive the order to Completed, throwing on an illegal jump.
     *
     * @param {string} changedBy
     * @returns {void}
     */
    complete(changedBy) {
        if (!this.transitionTo(RepairStatus.Completed, changedBy)) {
            throw new IllegalTransitionError(this.status, RepairStatus.Completed);
        }
    }

    /**
     * Parts-only subtotal; labour is the calculator's business.
     *
     * @returns {Money}
     */
    partsSubtotal() {
        return Money.sum(this.parts.map((line) => line.unitPrice.times(line.quantity)));
    }

    /**
     * Total through the bound strategy: the concrete class is the container's choice.
     *
     * @param {import("../container.js").Container} container
     * @returns {Money}
     */
    total(container) {
        return container.invoiceCalculator().calculate(this);
    }

    /**
     * Attach a part line, priced from the stock record.
     *
     * @param {import("./part.js").Part} part
     * @param {number} quantity
     * @returns {void}
     */
    addPart(part, quantity) {
        this.parts.push({ partId: part.id, sku: part.sku, quantity, unitPrice: part.unitPrice });
    }

    /** @returns {boolean} */
    isOpen() {
        return RepairStatus.isOpen(this.status);
    }

    /**
     * @param {number} id
     * @param {number} customerId
     * @param {number} deviceId
     * @returns {RepairOrder}
     */
    static seed(id, customerId, deviceId) {
        const order = new RepairOrder(id, customerId, deviceId);
        order.referenceNumber = id;

        return order;
    }
}

withReference(RepairOrder);
