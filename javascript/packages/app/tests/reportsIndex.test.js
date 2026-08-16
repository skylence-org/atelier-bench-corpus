import assert from "node:assert/strict";
import { test } from "node:test";

import { loadStatusFormatter, reportBySlug, reportSlugs } from "../src/reportsIndex.js";

test("createRequire reaches the CJS registry from ESM", () => {
    const slugs = reportSlugs();
    assert.equal(slugs.length, 24);
    assert.ok(slugs.includes("cash-flow"));
});

test("the JSDoc-generic helper finds a report by slug", () => {
    assert.equal(reportBySlug("cash-flow")?.slug, "cash-flow");
    assert.equal(reportBySlug("no-such-report"), undefined);
});

test("dynamic import() with a static specifier loads the reporting formatter", async () => {
    const formatter = await loadStatusFormatter();
    assert.equal(typeof formatter.statusLine, "function");
});
