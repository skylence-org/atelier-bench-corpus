/**
 * Tagged template for board captions.
 *
 * A tag is an ordinary function invoked with a template's static strings and
 * its interpolated values, so the call site carries no parentheses and no
 * argument list a plain call-graph walk would recognise.
 */

/**
 * Join a template's parts, rendering every interpolated value through String().
 *
 * @param {readonly string[]} strings
 * @param {...unknown} values
 * @returns {string}
 */
export function refTag(strings, ...values) {
    return strings.reduce(
        (out, part, index) => out + part + (index < values.length ? String(values[index]) : ""),
        "",
    );
}
