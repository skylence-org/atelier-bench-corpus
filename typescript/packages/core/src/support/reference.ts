/** Reference numbering rules. */

/**
 * Carrier for the reference-format constants.
 *
 * A class with only static members: the navigation target is the static
 * property, not an instance.
 */
export class Reference {
    /** Separator between prefix, year and number segments. */
    static readonly PREFIX_SEPARATOR = "-";

    /** Frozen year segment: the corpus seed must stay deterministic. */
    static readonly DEFAULT_YEAR = 2026;

    /** First number handed out by a fresh counter. */
    static readonly FIRST_NUMBER = 1;

    /** Next number in sequence. */
    static next(current: number): number {
        return current + 1;
    }

    private constructor() {}
}
