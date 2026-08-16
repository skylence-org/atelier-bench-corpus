/** Comma-separated rows, one line each. */

import type { ReportRow } from "../contracts/reportContract";
import { AbstractExporter } from "../support/abstractExporter";

/** Comma-separated rows, one line each. */
export class CsvExporter extends AbstractExporter {
    constructor() {
        super("csv", "text/csv");
    }

    override export(rows: readonly ReportRow[]): string {
        return rows.map((row) => `${row.label},${this.formatCents(row.cents)}`).join("\n");
    }
}
