/**
 * JSDoc generics: `@template` is the only place the type parameter exists.
 * `firstWhere(REPORTS, ...)` is typed as ReportContract | undefined by tsc
 * without a single TypeScript token in the lane.
 */

/**
 * First item satisfying `predicate`, or undefined.
 *
 * @template T
 * @param {readonly T[]} items
 * @param {(item: T) => boolean} predicate
 * @returns {T | undefined}
 */
export function firstWhere(items, predicate) {
    for (const item of items) {
        if (predicate(item)) {
            return item;
        }
    }

    return undefined;
}
