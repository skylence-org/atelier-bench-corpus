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

/** Sends the "your device is ready" notice. */
export class SendCompletionNotice implements Listener {
    readonly name = "send-completion-notice";
    sent = 0;

    handle(event: DomainEvent): void {
        if (event.kind === "repair_completed") {
            this.sent += 1;
        }
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
