/** `recalculate`: run the inventory job against the seeded dataset. */

import { Dispatcher, SendCompletionNotice } from "@atelier/core";

import { RecalculateInventory } from "../jobs";
import type { AppState } from "../state";

/** Run the job with the default threshold; returns the announced count. */
export function recalculateInventory(state: AppState): number {
    const dispatcher = new Dispatcher();
    dispatcher.register(new SendCompletionNotice());

    return new RecalculateInventory().run(state.data, dispatcher);
}
