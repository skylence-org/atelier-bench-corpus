/**
 * The contract behind the container binding.
 *
 * There is no interface keyword in JavaScript: the contract is a JSDoc
 * `@typedef` and nothing else. Two implementations live in `../services`; the
 * container decides which one an order sees.
 *
 * @typedef {object} InvoiceCalculator
 * @property {string} name Strategy name, used in report footers and logs.
 * @property {boolean} appliesSurcharge Does this strategy apply a priority surcharge at all?
 * @property {(order: import("../models/repairOrder.js").RepairOrder) => import("../money.js").Money} calculate Total payable for an order, surcharges included.
 */

/**
 * Runtime shape check, since the type surface is documentation only.
 *
 * @param {unknown} candidate
 * @returns {boolean}
 */
export function isInvoiceCalculator(candidate) {
    return (
        typeof candidate === "object" &&
        candidate !== null &&
        typeof (/** @type {InvoiceCalculator} */ (candidate).calculate) === "function"
    );
}
