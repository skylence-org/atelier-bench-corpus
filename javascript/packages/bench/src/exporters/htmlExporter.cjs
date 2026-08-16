/** One table, one row per report row. */

const { AbstractExporter } = require("../support/abstractExporter.cjs");

/** One table, one row per report row. */
class HtmlExporter extends AbstractExporter {
    constructor() {
        super("html", "text/html");
    }

    /**
     * @param {readonly import("../contracts/reportContract.cjs").ReportRow[]} rows
     * @returns {string}
     */
    export(rows) {
        const body = rows
            .map((row) => `<tr><td>${row.label}</td><td>${this.formatCents(row.cents)}</td></tr>`)
            .join("");

        return `<table>${body}</table>`;
    }
}

module.exports = { HtmlExporter };
