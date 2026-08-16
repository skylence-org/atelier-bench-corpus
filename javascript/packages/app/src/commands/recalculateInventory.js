/**
 * `recalculate`: run the inventory job against the seeded dataset.
 *
 * This command and the job's callback entry point in `../jobs.js` share the
 * name `recalculateInventory`. They are two different functions in two
 * modules; this one takes the app state, that one takes a callback.
 */

import { Dispatcher, SendCompletionNotice } from "@atelier/core";

import { recalculateInventoryAsync } from "../jobs.js";

/**
 * Run the job with the default threshold; resolves to the console line.
 *
 * @param {import("../state.js").AppState} state
 * @returns {Promise<string>}
 */
export async function recalculateInventory(state) {
    const dispatcher = new Dispatcher();
    new SendCompletionNotice().subscribe(dispatcher);

    return recalculateInventoryAsync(state.data, dispatcher);
}
