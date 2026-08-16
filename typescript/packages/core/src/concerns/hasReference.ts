/**
 * Shared reference behaviour as a class mixin.
 *
 * The mixin pattern is the TypeScript analogue of a trait: `Customer` and
 * `RepairOrder` both extend the anonymous class this function returns, so
 * `reference()` has no declaration in either model file.
 */

import { ATELIER_REF_PREFIX, atelierFormatReference } from "../support/helpers";

/** Anything the mixin can be applied to. */
export type Constructor<T = object> = new (...args: any[]) => T;

/** Contract the mixed-in behaviour adds. */
export interface Referenced {
    referenceNumber: number;
    reference(): string;
    shortReference(): string;
}

/** Prefix used when a model does not override it. */
export const DEFAULT_REFERENCE_PREFIX = ATELIER_REF_PREFIX;

/**
 * Add `reference()` / `shortReference()` to `Base`, using `prefix` for the
 * leading segment.
 */
export function withReference<TBase extends Constructor>(Base: TBase, prefix: string = DEFAULT_REFERENCE_PREFIX) {
    return class Referencing extends Base implements Referenced {
        referenceNumber = 0;

        /** Formatted reference such as `AT-2026-000123`. */
        reference(): string {
            return atelierFormatReference(prefix, this.referenceNumber);
        }

        /** Short form used in table cells: prefix plus number, no year. */
        shortReference(): string {
            return `${prefix}${this.referenceNumber}`;
        }
    };
}
