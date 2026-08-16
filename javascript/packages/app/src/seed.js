/** Deterministic seed reporting. */

import bench from "@atelier/bench";

const { METRICS, RuleRegistry } = bench;

/**
 * One-line description of the frozen dataset, printed by `seed`.
 *
 * @param {import("./state.js").AppState} state
 * @returns {string}
 */
export function summarize(state) {
    return [
        `seeded: ${state.data.customers.length} customer(s)`,
        `${state.data.orders.length} order(s)`,
        `${state.data.parts.length} part(s)`,
        `revenue ${state.data.revenueCents()}c`,
    ].join(", ");
}

/**
 * Every registered metric against the seed, in registry order.
 *
 * @param {import("./state.js").AppState} state
 * @returns {string[]}
 */
export function metricLines(state) {
    return METRICS.map((entry) => `${entry.key} = ${entry.formatted(state.data)}`);
}

/**
 * How many of the 48 rules hold on the seed.
 *
 * @param {import("./state.js").AppState} state
 * @returns {string}
 */
export function ruleLine(state) {
    return `rules: ${RuleRegistry.satisfied(state.data).length}/${RuleRegistry.RULES.length} satisfied`;
}
