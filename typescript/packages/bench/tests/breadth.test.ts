import { describe, expect, it } from "vitest";

import { METRICS, REPORTS, report, metric, Dataset } from "@atelier/bench";
import { CsvExporter } from "@atelier/bench/exporters/csvExporter";
import { JsonExporter } from "@atelier/bench/exporters/jsonExporter";
import { SmsNotifier } from "@atelier/bench/notifiers/smsNotifier";
import { OrderRepository } from "@atelier/bench/repositories/orderRepository";
import { GrossProfitReport } from "@atelier/bench/reports/grossProfitReport";
import { RevenueService } from "@atelier/bench/services/revenueService";
import { NotifyError } from "@atelier/bench";
import { formatting } from "@atelier/bench/concerns/hasFormatting";

describe("breadth subsystem", () => {
    it("registers every component", () => {
        expect(REPORTS).toHaveLength(24);
        expect(METRICS).toHaveLength(16);
    });

    it("keeps registry keys unique", () => {
        expect(new Set(REPORTS.map((r) => r.slug)).size).toBe(REPORTS.length);
        expect(new Set(METRICS.map((m) => m.key)).size).toBe(METRICS.length);
    });

    it("resolves a report through the registry", () => {
        const data = Dataset.seeded();

        expect(report("part-shortage")?.rows(data)).toHaveLength(2);
        expect(report("no-such-report")).toBeUndefined();
        expect(metric("part-cost")?.compute(data)).toBe(46300);
    });

    it("matches the frozen seed", () => {
        const rows = new GrossProfitReport().rows(Dataset.seeded());

        expect(rows[0]?.cents).toBe(58325);
        expect(rows[1]?.cents).toBe(46300);
        expect(rows[2]?.cents).toBe(12025);
    });

    it("renders every report against the seed", () => {
        const data = Dataset.seeded();

        for (const entry of REPORTS) {
            expect(entry.isEmpty(data)).toBe(entry.rows(data).length === 0);
        }
    });

    it("shares one structural formatting concern", () => {
        expect(formatting.formatValue(1.5)).toBe("1.50");
        expect(formatting.formatLabel("  spaced  ")).toBe("spaced");
    });

    it("exports the same rows differently", () => {
        const rows = new GrossProfitReport().rows(Dataset.seeded());

        expect(new CsvExporter().export(rows).startsWith("revenue,583.25")).toBe(true);
        expect(new JsonExporter().export(rows)).toContain('"label":"gross profit"');
        expect(new CsvExporter().filename("gross-profit")).toBe("gross-profit.csv");
    });

    it("enforces the sms length cap", () => {
        const sms = new SmsNotifier();

        expect(() => sms.send("subject", "x".repeat(200))).toThrow(NotifyError);
        expect(sms.send("subject", "short").channel).toBe("sms");
    });

    it("refuses to send from an unconfigured transport", () => {
        expect(() => new SmsNotifier("").send("s", "b")).toThrow(/not configured/);
    });

    it("pins repository generics to concrete types", () => {
        const repo = new OrderRepository(Dataset.seeded().orders);

        expect(repo.count()).toBe(4);
        expect(repo.find(1)).toBeDefined();
        expect(repo.find(99)).toBeUndefined();
        expect(repo.open()).toHaveLength(3);
    });

    it("sweeps the whole metric registry", () => {
        const sweep = new RevenueService().metricSweep(Dataset.seeded());

        expect(sweep).toHaveLength(16);
        expect(sweep.some(([key]) => key === "part-cost")).toBe(true);
    });
});
