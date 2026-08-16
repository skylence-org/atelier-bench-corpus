/** Comma-separated rows, one line each. */

const { AbstractExporter } = require("../support/abstractExporter.cjs");

/** Comma-separated rows, one line each. */
class CsvExporter extends AbstractExporter {
    constructor() {
        super("csv", "text/csv");
    }

    /**
     * @param {readonly import("../contracts/reportContract.cjs").ReportRow[]} rows
     * @returns {string}
     */
    export(rows) {
        return rows.map((row) => `${row.label},${this.formatCents(row.cents)}`).join("\n");
    }
}

module.exports = { CsvExporter };
