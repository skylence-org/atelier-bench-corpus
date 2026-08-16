/**
 * Shared request state.
 *
 * Two edges meet here. `@atelier/bench` is CommonJS and this file is ESM, so
 * the whole package arrives as one default import and is destructured after
 * the fact. And both halves of the same-name `Formatter` pair are held under
 * aliases: `money` is the billing one, `status` the reporting one.
 */

import bench from "@atelier/bench";
import { Container } from "@atelier/core";
import { Formatter as MoneyFormatter } from "@atelier/core/billing";
import { Formatter as StatusFormatter } from "@atelier/core/reporting";

const { Dataset } = bench;

/**
 * Everything a handler needs.
 *
 * @typedef {object} AppState
 * @property {Container} container
 * @property {import("@atelier/bench/dataset.cjs").Dataset} data
 * @property {MoneyFormatter} money
 * @property {StatusFormatter} status
 */

/**
 * Default binding plus the frozen dataset.
 *
 * @returns {AppState}
 */
export function seededState() {
    return {
        container: Container.bindDefault(),
        data: Dataset.seeded(),
        money: new MoneyFormatter("EUR"),
        status: new StatusFormatter("en"),
    };
}

/**
 * Same dataset, rush binding: the surcharge path becomes reachable.
 *
 * @returns {AppState}
 */
export function seededRushState() {
    return { ...seededState(), container: Container.bindRush() };
}
