/** JSON API. */

import type { Request, Response } from "express";
import { z } from "zod";

import { report as findReport } from "@atelier/bench";
import { NotFoundError, Priority } from "@atelier/core";

import { ApiValidationError } from "./errors";
import type { AppState } from "../state";

/** One row of `GET /api/orders`. */
export interface OrderSummary {
    readonly id: number;
    readonly reference: string;
    readonly status: string;
    readonly priority: string;
    readonly open: boolean;
}

/**
 * Request body of `POST /api/orders/:id/notes`.
 *
 * The schema is a value; {@link StoreNote} is the type inferred from it, so a
 * definition lookup on the type must land on the const below.
 */
export const storeNoteSchema = z.object({
    body: z.string().trim().min(1, "note body must not be empty"),
    author: z.string().optional(),
});

/** Inferred from {@link storeNoteSchema}: no separate declaration exists. */
export type StoreNote = z.infer<typeof storeNoteSchema>;

/** Every order, oldest id first. */
export function listOrders(state: AppState) {
    return (_req: Request, res: Response): void => {
        const rows: OrderSummary[] = state.data.orders.map((order) => ({
            id: order.id,
            reference: order.reference(),
            status: order.status,
            priority: Priority.label(order.priority),
            open: order.isOpen(),
        }));

        res.json(rows);
    };
}

/** Attach a note to an order, rejecting an empty body. */
export function storeNote(state: AppState) {
    return (req: Request, res: Response): void => {
        const parsed = storeNoteSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ApiValidationError("body", parsed.error.issues[0]?.message ?? "invalid payload");
        }

        const id = Number(req.params["id"]);
        const order = state.data.orders.find((candidate) => candidate.id === id);
        if (order === undefined) {
            throw new NotFoundError("repair order", String(id));
        }

        res.status(201).json({
            orderId: order.id,
            body: parsed.data.body,
            author: parsed.data.author ?? "counter",
        });
    };
}

/** Render one registered report by slug. */
export function showRegisteredReport(state: AppState) {
    return (req: Request, res: Response): void => {
        const slug = String(req.params["slug"]);
        const entry = findReport(slug);
        if (entry === undefined) {
            throw new ApiValidationError("slug", `unknown report ${slug}`);
        }

        res.json(entry.rows(state.data));
    };
}
