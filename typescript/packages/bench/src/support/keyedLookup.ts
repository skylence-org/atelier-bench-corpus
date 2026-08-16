/** Generic with a default type parameter, resolved via `keyof typeof`. */

const SEVERITY_WEIGHT = {
    low: 1,
    medium: 2,
    high: 3,
} as const;

export type SeverityKey = keyof typeof SEVERITY_WEIGHT;

export function weightOf<K extends SeverityKey = "low">(key: K = "low" as K): number {
    return SEVERITY_WEIGHT[key];
}

/** Call site relying on the default type parameter. */
export const lowWeight = weightOf();
