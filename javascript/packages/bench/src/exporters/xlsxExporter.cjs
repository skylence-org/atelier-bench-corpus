/** Cell addresses, one pair per row. */

const { AbstractExporter } = require("../support/abstractExporter.cjs");

/** Cell addresses, one pair per row. */
class XlsxExporter extends AbstractExporter {
    constructor() {
        super("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    /**
     * @param {readonly import("../contracts/reportContract.cjs").ReportRow[]} rows
     * @returns {string}
     */
    export(rows) {
        return rows
            .map((row, index) => `A${index + 1}=${row.label} B${index + 1}=${row.cents}`)
            .join(";");
    }
}

module.exports = { XlsxExporter };
