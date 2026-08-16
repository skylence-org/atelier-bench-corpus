/**
 * Consumer of the ambient module declaration in ../types/legacy-formatting.d.ts:
 * the specifier resolves to a `declare module` block, not to a file.
 */

import type { LegacyMoney } from "atelier-legacy-formatting";

/** Shape a cent amount the way the legacy formatter expects it. */
export function toLegacyMoney(cents: number): LegacyMoney {
    return { cents, currency: "EUR" };
}
