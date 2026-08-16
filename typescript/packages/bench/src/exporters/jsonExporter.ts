/** JSON rendering of the row objects. */

import type { ReportRow } from "../contracts/reportContract";
import { AbstractExporter } from "../support/abstractExporter";

/** JSON rendering of the row objects. */
export class JsonExporter extends AbstractExporter {
    constructor() {
        super("json", "application/json");
    }

    override export(rows: readonly ReportRow[]): string {
        return JSON.stringify(rows);
    }
}
