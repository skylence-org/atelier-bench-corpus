/**
 * ESM file reaching CommonJS two more ways than `state.js` does:
 * `createRequire` for a synchronous require of the CJS bench package, and a
 * dynamic `import()` with a STATIC specifier for the reporting formatter.
 */

import { createRequire } from "node:module";

import { firstWhere } from "@atelier/core/support/pick.js";

const require = createRequire(import.meta.url);

/** @type {{ REPORTS: readonly import("@atelier/bench/contracts/reportContract.cjs").ReportContract[] }} */
const { REPORTS } = require("@atelier/bench");

/** Every registered report slug, in registry order. */
export function reportSlugs() {
    return REPORTS.map((report) => report.slug);
}

/**
 * Registry lookup through the JSDoc-generic helper.
 *
 * @param {string} slug
 * @returns {import("@atelier/bench/contracts/reportContract.cjs").ReportContract | undefined}
 */
export function reportBySlug(slug) {
    return firstWhere(REPORTS, (report) => report.slug === slug);
}

/**
 * Dynamic import with a static, resolvable specifier: the module is loaded
 * lazily but the target is knowable without running anything.
 *
 * @returns {Promise<import("@atelier/core/reporting").Formatter>}
 */
export async function loadStatusFormatter() {
    const reporting = await import("@atelier/core/reporting");

    return new reporting.Formatter();
}
