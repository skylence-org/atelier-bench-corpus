/** Sheet stand-in listing cell coordinates. */

import type { ReportRow } from "../contracts/reportContract";
import { AbstractExporter } from "../support/abstractExporter";

/** Sheet stand-in listing cell coordinates. */
export class XlsxExporter extends AbstractExporter {
    constructor() {
        super("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    override export(rows: readonly ReportRow[]): string {
        return rows
            .map((row, index) => `A${index + 1}=${row.label} B${index + 1}=${row.cents}`)
            .join(";");
    }
}
