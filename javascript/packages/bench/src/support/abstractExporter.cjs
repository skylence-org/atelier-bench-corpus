/** Base shared by all 8 exporters. */

const { filenameFor } = require("../contracts/exporterContract.cjs");
const { formatterContract } = require("../contracts/formatterContract.cjs");

class AbstractExporter {
    /**
     * @param {string} extension
     * @param {string} mime
     */
    constructor(extension, mime) {
        this.extension = extension;
        this.mime = mime;
    }

    /**
     * @param {readonly import("../contracts/reportContract.cjs").ReportRow[]} rows
     * @returns {string}
     */
    export(rows) {
        throw new TypeError(`${this.extension} exporter does not implement export(${rows.length} rows)`);
    }

    /**
     * @param {string} slug
     * @returns {string}
     */
    filename(slug) {
        return filenameFor(slug, this.extension);
    }
}

// formatCents / formatPercent / formatCount have no declaration in this file.
Object.assign(AbstractExporter.prototype, formatterContract);

module.exports = { AbstractExporter };
