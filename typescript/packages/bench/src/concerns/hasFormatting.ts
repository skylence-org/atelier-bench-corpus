/**
 * Structural concern.
 *
 * No class declares `implements HasFormatting`: any object with the two methods
 * satisfies it structurally, which is the TypeScript analogue of a blanket impl.
 */

export interface HasFormatting {
    formatValue(value: number): string;
    formatLabel(label: string): string;
}

/** The shared body every component reuses. */
export const formatting: HasFormatting = {
    /** Two-decimal rendering used by every report footer. */
    formatValue(value: number): string {
        return value.toFixed(2);
    },

    formatLabel(label: string): string {
        return label.trim();
    },
};

/** Structural check: does `candidate` satisfy the concern at runtime? */
export function isFormatting(candidate: unknown): candidate is HasFormatting {
    return (
        typeof candidate === "object" &&
        candidate !== null &&
        typeof (candidate as HasFormatting).formatValue === "function"
    );
}
