/**
 * JSON API.
 *
 * Import precision: only `Left` is taken from the sibling pair in
 * `@atelier/core/support/pair.js`. `Right` lives in the same file and is not
 * imported here.
 */

import bench from "@atelier/bench";
import { NotFoundError, Priority } from "@atelier/core";
import { Left } from "@atelier/core/support/pair.js";

import { ApiValidationError } from "./errors.js";

const { report: findReport } = bench;

/**
 * One row of `GET /api/orders`.
 *
 * @typedef {object} OrderSummary
 * @property {number} id
 * @property {string} reference
 * @property {string} status
 * @property {string} priority
 * @property {boolean} open
 */

/**
 * Request body of `POST /api/orders/:id/notes`.
 *
 * There is no schema library in this lane: the shape is a typedef and the
 * check below is the only enforcement.
 *
 * @typedef {object} StoreNote
 * @property {string} body
 * @property {string} [author]
 */

/**
 * Validate a note payload, returning the failure branch when it is unusable.
 *
 * @param {unknown} payload
 * @returns {Left | undefined}
 */
export function validateNote(payload) {
    const body = /** @type {StoreNote} */ (payload)?.body;

    if (typeof body !== "string" || body.trim() === "") {
        return Left.of("body", "note body must not be empty");
    }

    return undefined;
}

/**
 * Every order, oldest id first.
 *
 * @param {import("../state.js").AppState} state
 * @returns {(req: import("express").Request, res: import("express").Response) => void}
 */
export function listOrders(state) {
    return (_req, res) => {
        /** @type {OrderSummary[]} */
        const rows = state.data.orders.map((order) => ({
            id: order.id,
            reference: order.reference(),
            status: order.status,
            priority: Priority.label(order.priority),
            open: order.isOpen(),
        }));

        res.json(rows);
    };
}

/**
 * Attach a note to an order, rejecting an empty body.
 *
 * @param {import("../state.js").AppState} state
 * @returns {(req: import("express").Request, res: import("express").Response) => void}
 */
export function storeNote(state) {
    return (req, res) => {
        const failure = validateNote(req.body);
        if (failure !== undefined) {
            throw new ApiValidationError(failure.field, failure.reason);
        }

        const id = Number(req.params.id);
        const order = state.data.orders.find((candidate) => candidate.id === id);
        if (order === undefined) {
            throw new NotFoundError("repair order", String(id));
        }

        res.status(201).json({
            orderId: order.id,
            body: req.body.body,
            author: req.body.author ?? "counter",
        });
    };
}

/**
 * Render one registered report by slug.
 *
 * @param {import("../state.js").AppState} state
 * @returns {(req: import("express").Request, res: import("express").Response) => void}
 */
export function showRegisteredReport(state) {
    return (req, res) => {
        const slug = String(req.params.slug);
        const entry = findReport(slug);
        if (entry === undefined) {
            throw new ApiValidationError("slug", `unknown report ${slug}`);
        }

        res.json(entry.rows(state.data));
    };
}
