/** JSON rendering of the row objects. */

const { AbstractExporter } = require("../support/abstractExporter.cjs");

/** JSON rendering of the row objects. */
class JsonExporter extends AbstractExporter {
    constructor() {
        super("json", "application/json");
    }

    /**
     * @param {readonly import("../contracts/reportContract.cjs").ReportRow[]} rows
     * @returns {string}
     */
    export(rows) {
        return JSON.stringify(rows);
    }
}

module.exports = { JsonExporter };
