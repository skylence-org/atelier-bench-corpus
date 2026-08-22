/** Domain events and their listeners. */

import type { RepairStatus } from "./support/status";

/** Discriminated union: the switch over `kind` must stay exhaustive. */
export type DomainEvent =
    | { readonly kind: "repair_completed"; readonly orderId: number; readonly reference: string }
    | { readonly kind: "status_changed"; readonly orderId: number; readonly from: RepairStatus; readonly to: RepairStatus }
    | { readonly kind: "stock_depleted"; readonly sku: string };

/** Channel a broadcast driver would publish on. */
export function channelFor(event: DomainEvent): string {
    switch (event.kind) {
        case "repair_completed":
        case "status_changed":
            return `orders.${event.orderId}`;
        case "stock_depleted":
            return "inventory";
    }
}

/** Handler contract; implementors are registered in a dispatcher. */
export interface Listener {
    readonly name: string;
    handle(event: DomainEvent): void;
}

/** Event fired when an order reaches a billable end state. */
export const REPAIR_COMPLETED = "repair.completed";

/** Event fired on every accepted lifecycle transition. */
export const STATUS_CHANGED = "status.changed";

/** Event fired when a part runs dry. */
export const STOCK_DEPLETED = "stock.depleted";

/** Payload carried by a string-keyed event. */
export interface EventPayload {
    readonly orderId?: number;
    readonly reference?: string;
    readonly sku?: string;
}

/** Sends the "your device is ready" notice. */
export class SendCompletionNotice implements Listener {
    readonly name = "send-completion-notice";
    sent = 0;
    last: string | undefined;

    handle(event: DomainEvent): void {
        if (event.kind === "repair_completed") {
            this.sent += 1;
        }
    }

    /**
     * Subscribe to the string-keyed event. The literal is the only link to the
     * emitting side.
     */
    subscribe(bus: StringBus): this {
        bus.on("repair.completed", (payload) => {
            this.sent += 1;
            this.last = payload.reference;
        });

        return this;
    }
}

/**
 * String-keyed fan-out beside the typed `Dispatcher`.
 *
 * The edge here is name-only resolution: a subscriber passes the literal
 * `'repair.completed'` and nothing declares that string as a symbol, so the
 * only way to connect `emit` to `on` is to match the literal.
 */
export class StringBus {
    private readonly handlers = new Map<string, Array<(payload: EventPayload) => void>>();

    /** Every event name this bus has emitted, in order. */
    readonly seen: string[] = [];

    on(event: string, handler: (payload: EventPayload) => void): void {
        const existing = this.handlers.get(event) ?? [];
        existing.push(handler);
        this.handlers.set(event, existing);
    }

    emit(event: string, payload: EventPayload): boolean {
        this.seen.push(event);
        const handlers = this.handlers.get(event) ?? [];

        for (const handler of handlers) {
            handler(payload);
        }

        return handlers.length > 0;
    }

    /** Names that have at least one subscriber, in subscription order. */
    subscribedNames(): string[] {
        return [...this.handlers.keys()];
    }
}

/** Fan-out point: every registered listener sees every event. */
export class Dispatcher {
    private readonly listeners: Listener[] = [];

    register(listener: Listener): void {
        this.listeners.push(listener);
    }

    dispatch(event: DomainEvent): void {
        for (const listener of this.listeners) {
            listener.handle(event);
        }
    }

    listenerNames(): string[] {
        return this.listeners.map((listener) => listener.name);
    }
}
