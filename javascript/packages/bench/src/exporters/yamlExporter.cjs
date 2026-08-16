/** Block-sequence YAML. */

const { AbstractExporter } = require("../support/abstractExporter.cjs");

/** Block-sequence YAML. */
class YamlExporter extends AbstractExporter {
    constructor() {
        super("yaml", "application/yaml");
    }

    /**
     * @param {readonly import("../contracts/reportContract.cjs").ReportRow[]} rows
     * @returns {string}
     */
    export(rows) {
        return rows.map((row) => `- label: ${row.label}\n  cents: ${row.cents}`).join("\n");
    }
}

module.exports = { YamlExporter };
