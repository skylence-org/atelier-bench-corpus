/** Flat element-per-row document. */

import type { ReportRow } from "../contracts/reportContract";
import { AbstractExporter } from "../support/abstractExporter";

/** Flat element-per-row document. */
export class XmlExporter extends AbstractExporter {
    constructor() {
        super("xml", "application/xml");
    }

    override export(rows: readonly ReportRow[]): string {
        const body = rows.map((row) => `<row label="${row.label}" cents="${row.cents}"/>`).join("");

        return `<rows>${body}</rows>`;
    }
}
