/** `report <slug>`: render one registered report as CSV. */

import { report as findReport } from "@atelier/bench";
import { CsvExporter } from "@atelier/bench/exporters/csvExporter";

import type { AppState } from "../state";

/** Render `slug` as CSV; throws when it is not registered. */
export function exportReport(state: AppState, slug: string): string {
    const entry = findReport(slug);
    if (entry === undefined) {
        throw new Error(`unknown report ${slug}`);
    }

    return new CsvExporter().export(entry.rows(state.data));
}
