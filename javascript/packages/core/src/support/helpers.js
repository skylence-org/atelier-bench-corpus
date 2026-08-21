/** Free functions and module-level constants. */

import { Reference } from "./reference.js";

/** Prefix stamped on every human-facing atelier reference. */
export const ATELIER_REF_PREFIX = "AT";

/** Zero-padded width of the numeric segment of a reference. */
export const ATELIER_REF_WIDTH = 6;

/**
 * Build a human-facing reference such as `AT-2026-000123`.
 *
 * The numeric segment is zero-padded width {@link ATELIER_REF_WIDTH}; the
 * separator comes from the static {@link Reference.PREFIX_SEPARATOR}.
 *
 * @param {string} prefix
 * @param {number} num
 * @param {number} [year]
 * @returns {string}
 */
export function atelierFormatReference(prefix, num, year = Reference.DEFAULT_YEAR) {
    const sep = Reference.PREFIX_SEPARATOR;
    const padded = String(num).padStart(ATELIER_REF_WIDTH, "0");

    return `${prefix}${sep}${year}${sep}${padded}`;
}

/**
 * Split a formatted reference back into its three segments.
 *
 * @param {string} reference
 * @returns {{ prefix: string, year: number, num: number } | undefined}
 */
export function atelierParseReference(reference) {
    const [prefix, year, num] = reference.split(Reference.PREFIX_SEPARATOR);
    if (prefix === undefined || year === undefined || num === undefined) {
        return undefined;
    }

    return { prefix, year: Number(year), num: Number(num) };
}
