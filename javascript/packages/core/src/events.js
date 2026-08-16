/**
 * Domain events on a node:events EventEmitter.
 *
 * The edge here is name-only resolution: listeners subscribe with the string
 * `'repair.completed'`, and nothing declares that name anywhere. The only way
 * to connect `emit` to `on` is to match the literal.
 */

import { EventEmitter } from "node:events";

/** Event fired when an order reaches a billable end state. */
export const REPAIR_COMPLETED = "repair.completed";

/** Event fired on every accepted lifecycle transition. */
export const STATUS_CHANGED = "status.changed";

/** Event fired when a part runs dry. */
export const STOCK_DEPLETED = "stock.depleted";

/**
 * Channel a broadcast driver would publish on.
 *
 * @param {string} event
 * @param {{ orderId?: number, sku?: string }} payload
 * @returns {string}
 */
export function channelFor(event, payload) {
    if (event === STOCK_DEPLETED) {
        return "inventory";
    }

    return `orders.${payload.orderId}`;
}

/**
 * Fan-out point: every registered listener sees every event it subscribed to.
 *
 * Extends the node built-in, so `dispatcher.on(...)` has no declaration in this
 * file at all.
 */
export class Dispatcher extends EventEmitter {
    constructor() {
        super();

        /** @type {string[]} */
        this.seen = [];
    }

    /**
     * Emit with the payload the listeners below expect.
     *
     * @param {string} event
     * @param {object} payload
     * @returns {boolean}
     */
    dispatch(event, payload) {
        this.seen.push(event);

        return this.emit(event, payload);
    }

    /** @returns {string[]} */
    listenerNames() {
        return this.eventNames().map(String);
    }
}

/** Sends the "your device is ready" notice. */
export class SendCompletionNotice {
    constructor() {
        this.name = "send-completion-notice";
        this.sent = 0;
    }

    /**
     * Subscribe to the string event. The literal is the only link to the
     * emitting side.
     *
     * @param {Dispatcher} dispatcher
     * @returns {SendCompletionNotice}
     */
    subscribe(dispatcher) {
        dispatcher.on("repair.completed", (payload) => this.handle(payload));

        return this;
    }

    /**
     * @param {{ orderId: number, reference: string }} payload
     * @returns {void}
     */
    handle(payload) {
        this.sent += 1;
        this.last = payload.reference;
    }
}
