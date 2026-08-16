/**
 * Customer-facing report endpoint.
 *
 * Live call path for the shadow pair: `state.money` and `state.status` are two
 * different `Formatter` classes reached through aliases in `../state.js`.
 */

import { NotFoundError } from "@atelier/core";

/**
 * What `GET /report/:reference` renders.
 *
 * @typedef {object} ReportView
 * @property {string} reference
 * @property {string} customer
 * @property {string} device
 * @property {string} status
 * @property {string} total
 * @property {string} calculator
 */

/**
 * Look an order up by its formatted reference, then render it.
 *
 * @param {import("../state.js").AppState} state
 * @returns {(req: import("express").Request, res: import("express").Response) => void}
 */
export function showReport(state) {
    return (req, res) => {
        const reference = String(req.params.reference);
        const order = state.data.orders.find((candidate) => candidate.reference() === reference);
        if (order === undefined) {
            throw new NotFoundError("repair order", reference);
        }

        const customer = state.data.customers.find((candidate) => candidate.id === order.customerId);
        const device = state.data.devices.find((candidate) => candidate.id === order.deviceId);

        /** @type {ReportView} */
        const view = {
            reference,
            customer: customer?.displayName() ?? "",
            device: device?.label() ?? "",
            status: state.status.statusLine(order.status, "intake"),
            total: state.money.money(order.total(state.container), "EUR"),
            calculator: state.container.invoiceCalculator().name,
        };

        res.json(view);
    };
}
