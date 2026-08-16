/** Deterministic seed reporting. */

import { METRICS } from "@atelier/bench";

import type { AppState } from "./state";

/** One-line description of the frozen dataset, printed by `seed`. */
export function summarize(state: AppState): string {
    return [
        `seeded: ${state.data.customers.length} customer(s)`,
        `${state.data.orders.length} order(s)`,
        `${state.data.parts.length} part(s)`,
        `revenue ${state.data.revenueCents()}c`,
    ].join(", ");
}

/** Every registered metric against the seed, in registry order. */
export function metricLines(state: AppState): string[] {
    return METRICS.map((entry) => `${entry.key} = ${entry.formatted(state.data)}`);
}
