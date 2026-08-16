/** Repair lifecycle states. */

/**
 * Lifecycle state of a repair order.
 *
 * JavaScript has no enum: the states and the behaviour over them share one
 * frozen object, so `RepairStatus.Completed` and `RepairStatus.label` are two
 * properties of the same declaration.
 *
 * @typedef {"received" | "diagnosing" | "awaiting_parts" | "repairing" | "completed" | "collected"} RepairStatusValue
 */

/** @type {Readonly<Record<string, readonly RepairStatusValue[]>>} */
const TRANSITIONS = Object.freeze({
    received: ["diagnosing"],
    diagnosing: ["awaiting_parts", "repairing"],
    awaiting_parts: ["repairing"],
    repairing: ["completed"],
    completed: ["collected"],
    collected: [],
});

/** @type {Readonly<Record<string, string>>} */
const LABELS = Object.freeze({
    received: "Received",
    diagnosing: "Diagnosing",
    awaiting_parts: "Awaiting parts",
    repairing: "Repairing",
    completed: "Completed",
    collected: "Collected",
});

export const RepairStatus = Object.freeze({
    Received: /** @type {RepairStatusValue} */ ("received"),
    Diagnosing: /** @type {RepairStatusValue} */ ("diagnosing"),
    AwaitingParts: /** @type {RepairStatusValue} */ ("awaiting_parts"),
    Repairing: /** @type {RepairStatusValue} */ ("repairing"),
    Completed: /** @type {RepairStatusValue} */ ("completed"),
    Collected: /** @type {RepairStatusValue} */ ("collected"),

    /**
     * States reachable in one hop from `status`.
     *
     * @param {RepairStatusValue} status
     * @returns {readonly RepairStatusValue[]}
     */
    transitionsTo(status) {
        return TRANSITIONS[status] ?? [];
    },

    /**
     * Human label for report and admin surfaces.
     *
     * @param {RepairStatusValue} status
     * @returns {string}
     */
    label(status) {
        return LABELS[status] ?? status;
    },

    /**
     * No further transition is possible from a terminal state.
     *
     * @param {RepairStatusValue} status
     * @returns {boolean}
     */
    isTerminal(status) {
        return RepairStatus.transitionsTo(status).length === 0;
    },

    /**
     * Is the order still occupying bench space?
     *
     * @param {RepairStatusValue} status
     * @returns {boolean}
     */
    isOpen(status) {
        return status !== "completed" && status !== "collected";
    },
});
