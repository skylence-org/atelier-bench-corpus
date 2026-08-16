/**
 * Ambient MODULE declaration for an untyped dependency that ships no types
 * (and, in this corpus, no code: it is only ever imported with `import type`).
 */

declare module "atelier-legacy-formatting" {
    export interface LegacyMoney {
        readonly cents: number;
        readonly currency: string;
    }

    export function legacyFormat(money: LegacyMoney): string;
}
