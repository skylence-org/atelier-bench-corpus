/** Markdown table with a fixed header. */

const { AbstractExporter } = require("../support/abstractExporter.cjs");

/** Markdown table with a fixed header. */
class MarkdownExporter extends AbstractExporter {
    constructor() {
        super("md", "text/markdown");
    }

    /**
     * @param {readonly import("../contracts/reportContract.cjs").ReportRow[]} rows
     * @returns {string}
     */
    export(rows) {
        const head = ["| label | amount |", "| --- | --- |"];
        const body = rows.map((row) => `| ${row.label} | ${this.formatCents(row.cents)} |`);

        return [...head, ...body].join("\n");
    }
}

module.exports = { MarkdownExporter };
