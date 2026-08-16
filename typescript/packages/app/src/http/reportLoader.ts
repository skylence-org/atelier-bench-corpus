/**
 * Async surface: an async function, a generator, an async generator and a
 * `for await` consumer, plus a `paths`-alias import (`@app/*` from
 * tsconfig.base.json) instead of a relative path.
 */

import type { RepairOrder } from "@atelier/core";

import type { AppState } from "@app/state";

/** Resolves an order by reference; async so callers `await` it. */
export async function loadOrder(state: AppState, reference: string): Promise<RepairOrder | undefined> {
    return state.data.orders.find((candidate) => candidate.reference() === reference);
}

/** Generator: yields the open orders one at a time. */
export function* iterateOpenOrders(state: AppState): Generator<RepairOrder, void, undefined> {
    for (const order of state.data.openOrders()) {
        yield order;
    }
}

/** Async generator: the open orders' references. */
export async function* streamReferences(state: AppState): AsyncGenerator<string, void, undefined> {
    for (const order of iterateOpenOrders(state)) {
        yield order.reference();
    }
}

/** `for await` consumer of the async generator. */
export async function collectOpenReferences(state: AppState): Promise<string[]> {
    const references: string[] = [];
    for await (const reference of streamReferences(state)) {
        references.push(reference);
    }

    return references;
}

/** `await` consumer of the async function. */
export async function describeOrder(state: AppState, reference: string): Promise<string | null> {
    const order = await loadOrder(state, reference);

    return order === undefined ? null : order.reference();
}
