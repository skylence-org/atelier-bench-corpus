/** HTTP error mapping. */

import type { NextFunction, Request, Response } from "express";

import { AtelierError } from "@atelier/core";

/** The request itself was malformed. */
export class ApiValidationError extends Error {
    readonly statusCode = 422;

    constructor(
        readonly field: string,
        message: string,
    ) {
        super(message);
        this.name = "ApiValidationError";
    }
}

/**
 * Terminal error middleware.
 *
 * Domain errors carry their own status code; everything else is a 500.
 */
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof ApiValidationError) {
        res.status(error.statusCode).json({ error: error.message, field: error.field });

        return;
    }

    if (error instanceof AtelierError) {
        res.status(error.statusCode).json({ error: error.message });

        return;
    }

    res.status(500).json({ error: "internal error" });
}
