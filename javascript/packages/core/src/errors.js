/** Domain error hierarchy. */

/**
 * Base class every domain error extends.
 *
 * `statusCode` is set by each subclass; there is no declared abstract member to
 * lean on, so the contract is the JSDoc plus the constructor.
 */
export class AtelierError extends Error {
    /**
     * @param {string} message
     * @param {number} statusCode
     */
    constructor(message, statusCode) {
        super(message);
        this.name = "AtelierError";
        this.statusCode = statusCode;
    }

    /**
     * Recoverable errors are surfaced to the customer; the rest are logged.
     *
     * @returns {boolean}
     */
    get clientVisible() {
        return this.statusCode < 500;
    }
}

/** A record was addressed that does not exist. */
export class NotFoundError extends AtelierError {
    /**
     * @param {string} kind
     * @param {string} key
     */
    constructor(kind, key) {
        super(`no ${kind} with key ${key}`, 404);
        this.name = "NotFoundError";
        this.kind = kind;
        this.key = key;
    }
}

/** The lifecycle refused a transition. */
export class IllegalTransitionError extends AtelierError {
    /**
     * @param {string} from
     * @param {string} to
     */
    constructor(from, to) {
        super(`illegal transition ${from} -> ${to}`, 409);
        this.name = "IllegalTransitionError";
        this.from = from;
        this.to = to;
    }
}

/** A payload failed validation before it reached the domain. */
export class ValidationError extends AtelierError {
    /**
     * @param {string} field
     * @param {string} message
     */
    constructor(field, message) {
        super(message, 422);
        this.name = "ValidationError";
        this.field = field;
    }
}
