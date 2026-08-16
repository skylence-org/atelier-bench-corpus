/** Attribute-only XML document. */

const { AbstractExporter } = require("../support/abstractExporter.cjs");

/** Attribute-only XML document. */
class XmlExporter extends AbstractExporter {
    constructor() {
        super("xml", "application/xml");
    }

    /**
     * @param {readonly import("../contracts/reportContract.cjs").ReportRow[]} rows
     * @returns {string}
     */
    export(rows) {
        const body = rows.map((row) => `<row label="${row.label}" cents="${row.cents}"/>`).join("");

        return `<rows>${body}</rows>`;
    }
}

module.exports = { XmlExporter };
