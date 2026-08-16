/** Order priority and its pricing effect. */

/**
 * How urgently an order is handled.
 *
 * @typedef {"standard" | "rush" | "warranty"} PriorityValue
 */

/** @type {Readonly<Record<string, number>>} */
const SURCHARGE_BP = Object.freeze({
    standard: 0,
    rush: 2500,
    warranty: 0,
});

/** @type {Readonly<Record<string, string>>} */
const LABELS = Object.freeze({
    standard: "Standard",
    rush: "Rush",
    warranty: "Warranty",
});

export const Priority = Object.freeze({
    Standard: /** @type {PriorityValue} */ ("standard"),
    Rush: /** @type {PriorityValue} */ ("rush"),
    Warranty: /** @type {PriorityValue} */ ("warranty"),

    /**
     * Surcharge in basis points applied to the labour subtotal.
     *
     * @param {PriorityValue} priority
     * @returns {number}
     */
    surchargeBp(priority) {
        return SURCHARGE_BP[priority] ?? 0;
    },

    /**
     * @param {PriorityValue} priority
     * @returns {string}
     */
    label(priority) {
        return LABELS[priority] ?? priority;
    },

    /**
     * Rush work jumps the queue; warranty work does not.
     *
     * @param {PriorityValue} priority
     * @returns {boolean}
     */
    isExpedited(priority) {
        return priority === "rush";
    },

    /**
     * Warranty orders are never invoiced to the customer.
     *
     * @param {PriorityValue} priority
     * @returns {boolean}
     */
    isBillable(priority) {
        return priority !== "warranty";
    },
});
