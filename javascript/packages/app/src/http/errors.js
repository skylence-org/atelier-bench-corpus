/** HTTP error mapping. */

import { AtelierError } from "@atelier/core";

/** The request itself was malformed. */
export class ApiValidationError extends Error {
    /**
     * @param {string} field
     * @param {string} message
     */
    constructor(field, message) {
        super(message);
        this.name = "ApiValidationError";
        this.statusCode = 422;
        this.field = field;
    }
}

/**
 * Terminal error middleware.
 *
 * Domain errors carry their own status code; everything else is a 500.
 *
 * @param {unknown} error
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 * @returns {void}
 */
export function errorHandler(error, _req, res, _next) {
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
