/** Background work. */

import type { Dataset } from "@atelier/bench";
import type { Dispatcher } from "@atelier/core";

/** Recount consumed parts and announce anything that ran dry. */
export class RecalculateInventory {
    /** Stock at or below this level counts as depleted. */
    static readonly DEFAULT_THRESHOLD = 1;

    constructor(readonly threshold: number = RecalculateInventory.DEFAULT_THRESHOLD) {}

    /** Returns how many parts were announced as depleted. */
    run(data: Dataset, dispatcher: Dispatcher): number {
        let announced = 0;

        for (const part of data.parts) {
            if (part.stock > this.threshold) {
                continue;
            }

            dispatcher.dispatch({ kind: "stock_depleted", sku: part.sku });
            announced += 1;
        }

        return announced;
    }
}
