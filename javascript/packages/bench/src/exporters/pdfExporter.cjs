/** Stub PDF envelope with a row count. */

const { AbstractExporter } = require("../support/abstractExporter.cjs");

/** Stub PDF envelope with a row count. */
class PdfExporter extends AbstractExporter {
    constructor() {
        super("pdf", "application/pdf");
    }

    /**
     * @param {readonly import("../contracts/reportContract.cjs").ReportRow[]} rows
     * @returns {string}
     */
    export(rows) {
        return `%PDF-1.7\n% ${this.formatCount(rows.length)} row(s)\n%%EOF`;
    }
}

module.exports = { PdfExporter };
