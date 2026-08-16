/** Minimal table markup. */

import type { ReportRow } from "../contracts/reportContract";
import { AbstractExporter } from "../support/abstractExporter";

/** Minimal table markup. */
export class HtmlExporter extends AbstractExporter {
    constructor() {
        super("html", "text/html");
    }

    override export(rows: readonly ReportRow[]): string {
        const body = rows
            .map((row) => `<tr><td>${row.label}</td><td>${this.formatCents(row.cents)}</td></tr>`)
            .join("");

        return `<table>${body}</table>`;
    }
}
