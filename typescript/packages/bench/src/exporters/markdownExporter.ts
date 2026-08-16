/** Pipe table with a header rule. */

import type { ReportRow } from "../contracts/reportContract";
import { AbstractExporter } from "../support/abstractExporter";

/** Pipe table with a header rule. */
export class MarkdownExporter extends AbstractExporter {
    constructor() {
        super("md", "text/markdown");
    }

    override export(rows: readonly ReportRow[]): string {
        const head = ["| label | amount |", "| --- | --- |"];
        const body = rows.map((row) => `| ${row.label} | ${this.formatCents(row.cents)} |`);

        return [...head, ...body].join("\n");
    }
}
