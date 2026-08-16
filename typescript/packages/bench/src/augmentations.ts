/**
 * Module augmentation.
 *
 * `debugLabel()` is added to a class declared in another package. A definition
 * lookup on a `formatter.debugLabel()` call site must land here, not in
 * @atelier/core, and the class itself never mentions it.
 */

import { Formatter } from "@atelier/core/billing";

declare module "@atelier/core/billing" {
    interface Formatter {
        /** Corpus-only debug helper injected by @atelier/bench. */
        debugLabel(): string;
    }
}

Formatter.prototype.debugLabel = function debugLabel(this: Formatter): string {
    return `billing-formatter(${this.money.name})`;
};

export {};
