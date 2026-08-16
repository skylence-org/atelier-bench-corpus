/** Header-only stand-in: the corpus never renders real PDFs. */

import type { ReportRow } from "../contracts/reportContract";
import { AbstractExporter } from "../support/abstractExporter";

/** Header-only stand-in: the corpus never renders real PDFs. */
export class PdfExporter extends AbstractExporter {
    constructor() {
        super("pdf", "application/pdf");
    }

    override export(rows: readonly ReportRow[]): string {
        return `%PDF-1.7\n% ${this.formatCount(rows.length)} row(s)\n%%EOF`;
    }
}
