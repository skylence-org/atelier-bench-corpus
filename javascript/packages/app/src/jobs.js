/**
 * Background work, written three ways.
 *
 * The same recount is exposed as a node-style callback, as a promise built by
 * hand, and as an `async` function. All three end at `RecalculateInventory.run`,
 * so a tool that follows only one style sees a third of the call graph.
 */

import { STOCK_DEPLETED } from "@atelier/core";

/** Recount consumed parts and announce anything that ran dry. */
export class RecalculateInventory {
    /** Stock at or below this level counts as depleted. */
    static DEFAULT_THRESHOLD = 1;

    /** @param {number} [threshold] */
    constructor(threshold = RecalculateInventory.DEFAULT_THRESHOLD) {
        this.threshold = threshold;
    }

    /**
     * Returns how many parts were announced as depleted.
     *
     * @param {import("@atelier/bench/dataset.cjs").Dataset} data
     * @param {import("@atelier/core").Dispatcher} dispatcher
     * @returns {number}
     */
    run(data, dispatcher) {
        let announced = 0;

        for (const part of data.parts) {
            if (part.stock > this.threshold) {
                continue;
            }

            dispatcher.dispatch(STOCK_DEPLETED, { sku: part.sku });
            announced += 1;
        }

        return announced;
    }
}

/**
 * Callback style: node-order `(error, count)`, called on the next tick.
 *
 * @param {import("@atelier/bench/dataset.cjs").Dataset} data
 * @param {import("@atelier/core").Dispatcher} dispatcher
 * @param {(error: Error | null, count?: number) => void} callback
 * @returns {void}
 */
export function recalculateInventory(data, dispatcher, callback) {
    queueMicrotask(() => {
        try {
            callback(null, new RecalculateInventory().run(data, dispatcher));
        } catch (error) {
            callback(/** @type {Error} */ (error));
        }
    });
}

/**
 * Promise style: the callback above, wrapped by hand. No `async` keyword.
 *
 * @param {import("@atelier/bench/dataset.cjs").Dataset} data
 * @param {import("@atelier/core").Dispatcher} dispatcher
 * @returns {Promise<number>}
 */
export function recalculateInventoryPromise(data, dispatcher) {
    return new Promise((resolve, reject) => {
        recalculateInventory(data, dispatcher, (error, count) => {
            if (error) {
                reject(error);

                return;
            }

            resolve(/** @type {number} */ (count));
        });
    });
}

/**
 * Async/await style: the third face of the same job.
 *
 * @param {import("@atelier/bench/dataset.cjs").Dataset} data
 * @param {import("@atelier/core").Dispatcher} dispatcher
 * @returns {Promise<string>}
 */
export async function recalculateInventoryAsync(data, dispatcher) {
    const count = await recalculateInventoryPromise(data, dispatcher);

    return `recalculated ${count} part(s)`;
}
