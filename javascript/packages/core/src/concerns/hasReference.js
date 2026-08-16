/**
 * Shared reference behaviour, installed with `Object.assign`.
 *
 * `Customer` and `RepairOrder` both take these methods onto their prototype, so
 * `reference()` has no declaration in either model file. The JavaScript
 * analogue of a PHP trait or a Rust default trait body.
 */

import { ATELIER_REF_PREFIX, atelierFormatReference } from "../support/helpers.js";

/** Prefix used when a model does not override it. */
export const DEFAULT_REFERENCE_PREFIX = ATELIER_REF_PREFIX;

/**
 * The mixin itself: a plain object of methods, copied onto a prototype.
 *
 * @type {{ reference(): string, shortReference(): string }}
 */
export const hasReference = {
    /**
     * Formatted reference such as `AT-2026-000123`.
     *
     * @returns {string}
     */
    reference() {
        return atelierFormatReference(this.referencePrefix, this.referenceNumber);
    },

    /**
     * Short form used in table cells: prefix plus number, no year.
     *
     * @returns {string}
     */
    shortReference() {
        return `${this.referencePrefix}${this.referenceNumber}`;
    },
};

/**
 * Copy {@link hasReference} onto `Target.prototype` and pin its prefix.
 *
 * @template {Function} T
 * @param {T} Target
 * @param {string} [prefix]
 * @returns {T}
 */
export function withReference(Target, prefix = DEFAULT_REFERENCE_PREFIX) {
    Object.assign(Target.prototype, hasReference);
    Target.prototype.referencePrefix = prefix;
    Target.prototype.referenceNumber = 0;

    return Target;
}
