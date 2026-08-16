/** Domain error hierarchy. */

import type { RepairStatus } from "./support/status";

/** Base class every domain error extends. */
export abstract class AtelierError extends Error {
    abstract readonly statusCode: number;

    /** Recoverable errors are surfaced to the customer; the rest are logged. */
    get clientVisible(): boolean {
        return this.statusCode < 500;
    }
}

/** A record was addressed that does not exist. */
export class NotFoundError extends AtelierError {
    override readonly statusCode = 404;

    constructor(
        readonly kind: string,
        readonly key: string,
    ) {
        super(`no ${kind} with key ${key}`);
        this.name = "NotFoundError";
    }
}

/** The lifecycle refused a transition. */
export class IllegalTransitionError extends AtelierError {
    override readonly statusCode = 409;

    constructor(
        readonly from: RepairStatus,
        readonly to: RepairStatus,
    ) {
        super(`illegal transition ${from} -> ${to}`);
        this.name = "IllegalTransitionError";
    }
}

/** A payload failed validation before it reached the domain. */
export class ValidationError extends AtelierError {
    override readonly statusCode = 422;

    constructor(
        readonly field: string,
        message: string,
    ) {
        super(message);
        this.name = "ValidationError";
    }
}
