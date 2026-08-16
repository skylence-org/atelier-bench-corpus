/** Reference numbering rules. */

/**
 * Carrier for the reference-format constants.
 *
 * A class with only static members: the navigation target is the static
 * property, not an instance.
 */
export class Reference {
    /** Separator between prefix, year and number segments. */
    static PREFIX_SEPARATOR = "-";

    /** Frozen year segment: the corpus seed must stay deterministic. */
    static DEFAULT_YEAR = 2026;

    /** First number handed out by a fresh counter. */
    static FIRST_NUMBER = 1;

    /**
     * Next number in sequence.
     *
     * @param {number} current
     * @returns {number}
     */
    static next(current) {
        return current + 1;
    }
}
