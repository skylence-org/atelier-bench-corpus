import { describe, expect, it } from "vitest";

import { h } from "../src/views/h";
import { ReportCard } from "../src/views/reportCard";
import { renderReportPage } from "../src/views/reportPage";

describe("tsx views", () => {
    it("renders a component through the h factory", () => {
        const html = String(ReportCard({ reference: "AT-2026-000001", total: "349.00 EUR", status: "Completed" }));

        expect(html).toBe(
            '<article class="report-card" data-reference="AT-2026-000001"><h2>AT-2026-000001</h2><p class="status">Completed</p><p class="total">349.00 EUR</p></article>',
        );
    });

    it("renders a page with a fragment, intrinsic elements and a component element", () => {
        const html = renderReportPage({
            reference: "AT-2026-000002",
            customer: "Grace Hopper",
            device: "ThinkPad",
            status: "Repairing",
            total: "292.81 EUR",
            calculator: "rush",
        });

        expect(html.html.startsWith("<h1>Repair report</h1><article")).toBe(true);
        expect(html.html).toContain('data-reference="AT-2026-000002"');
    });

    it("escapes text children", () => {
        expect(String(h("p", null, "<b>"))).toBe("<p>&lt;b&gt;</p>");
    });
});
