/** Block sequence, two keys per entry. */

import type { ReportRow } from "../contracts/reportContract";
import { AbstractExporter } from "../support/abstractExporter";

/** Block sequence, two keys per entry. */
export class YamlExporter extends AbstractExporter {
    constructor() {
        super("yaml", "application/yaml");
    }

    override export(rows: readonly ReportRow[]): string {
        return rows.map((row) => `- label: ${row.label}\n  cents: ${row.cents}`).join("\n");
    }
}
