/**
 * Shared request state.
 *
 * Both halves of the same-name `Formatter` pair are held here under aliases:
 * `money` is the billing one, `status` the reporting one.
 */

import { Dataset } from "@atelier/bench";
import { Container } from "@atelier/core";
import { Formatter as MoneyFormatter } from "@atelier/core/billing";
import { Formatter as StatusFormatter } from "@atelier/core/reporting";

/** Everything a handler needs. */
export interface AppState {
    readonly container: Container;
    readonly data: Dataset;
    readonly money: MoneyFormatter;
    readonly status: StatusFormatter;
}

/** Default binding plus the frozen dataset. */
export function seededState(): AppState {
    return {
        container: Container.bindDefault(),
        data: Dataset.seeded(),
        money: new MoneyFormatter("EUR"),
        status: new StatusFormatter("en"),
    };
}

/** Same dataset, rush binding: the surcharge path becomes reachable. */
export function seededRushState(): AppState {
    return { ...seededState(), container: Container.bindRush() };
}
