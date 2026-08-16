/** Serialisation targets for rendered rows. */

/**
 * Turns rows into a body string.
 *
 * @typedef {object} ExporterContract
 * @property {string} extension
 * @property {string} mime
 * @property {(rows: readonly import("./reportContract.cjs").ReportRow[]) => string} export
 * @property {(slug: string) => string} filename
 */

/**
 * Download filename for a report slug.
 *
 * @param {string} slug
 * @param {string} extension
 * @returns {string}
 */
function filenameFor(slug, extension) {
    return `${slug}.${extension}`;
}

module.exports = { filenameFor };
