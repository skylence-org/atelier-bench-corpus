/** Free functions and module-level constants. */

import { Reference } from "./reference";

/** Prefix stamped on every human-facing atelier reference. */
export const ATELIER_REF_PREFIX = "AT";

/** Zero-padded width of the numeric segment of a reference. */
export const ATELIER_REF_WIDTH = 6;

/**
 * Build a human-facing reference such as `AT-2026-000123`.
 *
 * The numeric segment is zero-padded width {@link ATELIER_REF_WIDTH}; the
 * separator comes from the static {@link Reference.PREFIX_SEPARATOR}.
 */
export function atelierFormatReference(prefix: string, num: number): string;
export function atelierFormatReference(prefix: string, num: number, year: number): string;
export function atelierFormatReference(
    prefix: string,
    num: number,
    year: number = Reference.DEFAULT_YEAR,
): string {
    const sep = Reference.PREFIX_SEPARATOR;
    const padded = String(num).padStart(ATELIER_REF_WIDTH, "0");

    return `${prefix}${sep}${year}${sep}${padded}`;
}

/** Split a formatted reference back into its three segments. */
export function atelierParseReference(
    reference: string,
): { prefix: string; year: number; num: number } | undefined {
    const [prefix, year, num] = reference.split(Reference.PREFIX_SEPARATOR);
    if (prefix === undefined || year === undefined || num === undefined) {
        return undefined;
    }

    return { prefix, year: Number(year), num: Number(num) };
}
