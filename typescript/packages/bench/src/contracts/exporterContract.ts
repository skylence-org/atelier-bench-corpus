/** Serialisation targets for rendered rows. */

import type { ReportRow } from "./reportContract";

/** Turns rows into a body string. */
export interface ExporterContract {
    readonly extension: string;
    readonly mime: string;

    /** Render `rows` in this exporter's format. */
    export(rows: readonly ReportRow[]): string;

    /** Download filename for a report slug. */
    filename(slug: string): string;
}
