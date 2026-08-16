/** Number formatting shared by exporters and report footers. */

export interface FormatterContract {
    /** Render an exact cent amount. */
    formatCents(cents: number): string;

    /** Render a 0-1 ratio as a percentage. */
    formatPercent(ratio: number): string;

    /** Render a plain count. */
    formatCount(count: number): string;
}
