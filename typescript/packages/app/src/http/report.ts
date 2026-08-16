/**
 * Customer-facing report endpoint.
 *
 * Live call path for the shadow pair: `state.money` and `state.status` are two
 * different `Formatter` classes reached through aliases in `../state`.
 */

import type { Request, Response } from "express";

import { NotFoundError, RepairStatus } from "@atelier/core";

import type { AppState } from "../state";

/** What `GET /report/:reference` renders. */
export interface ReportView {
    readonly reference: string;
    readonly customer: string;
    readonly device: string;
    readonly status: string;
    readonly total: string;
    readonly calculator: string;
}

/** Look an order up by its formatted reference, then render it. */
export function showReport(state: AppState) {
    return (req: Request, res: Response): void => {
        const reference = String(req.params["reference"]);
        const order = state.data.orders.find((candidate) => candidate.reference() === reference);
        if (order === undefined) {
            throw new NotFoundError("repair order", reference);
        }

        const customer = state.data.customers.find((candidate) => candidate.id === order.customerId);
        const device = state.data.devices.find((candidate) => candidate.id === order.deviceId);

        const view: ReportView = {
            reference,
            customer: customer?.displayName() ?? "",
            device: device?.label() ?? "",
            status: state.status.statusLine(order.status as RepairStatus, "intake"),
            total: state.money.money(order.total(state.container), "EUR"),
            calculator: state.container.invoiceCalculator().name,
        };

        res.json(view);
    };
}
