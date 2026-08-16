/**
 * `report <slug>`: render one registered report.
 *
 * The lane's single `createRequire` site. The exporter is a CommonJS module
 * picked by extension at call time, so it cannot be an `import` statement: the
 * require built here is the only way in from an ESM file.
 */

import { createRequire } from "node:module";

import bench from "@atelier/bench";

const require = createRequire(import.meta.url);

const { report: findReport } = bench;

/** Exporter module per file extension, resolved lazily. */
const EXPORTER_MODULES = Object.freeze({
    csv: "@atelier/bench/exporters/csvExporter.cjs",
    json: "@atelier/bench/exporters/jsonExporter.cjs",
    md: "@atelier/bench/exporters/markdownExporter.cjs",
});

/**
 * Render `slug` in `format`; throws when either is unknown.
 *
 * @param {import("../state.js").AppState} state
 * @param {string} slug
 * @param {"csv" | "json" | "md"} [format]
 * @returns {string}
 */
export function exportReport(state, slug, format = "csv") {
    const entry = findReport(slug);
    if (entry === undefined) {
        throw new Error(`unknown report ${slug}`);
    }

    const modulePath = EXPORTER_MODULES[format];
    if (modulePath === undefined) {
        throw new Error(`unknown export format ${format}`);
    }

    const exporters = require(modulePath);
    const [Exporter] = Object.values(exporters);

    return new Exporter().export(entry.rows(state.data));
}
