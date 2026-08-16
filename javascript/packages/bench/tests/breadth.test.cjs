const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const {
    Dataset,
    METRICS,
    NotifyError,
    REPORTS,
    loadReport,
    metric,
    report,
} = require("@atelier/bench");
const { CsvExporter } = require("@atelier/bench/exporters/csvExporter.cjs");
const { JsonExporter } = require("@atelier/bench/exporters/jsonExporter.cjs");
const { SmsNotifier } = require("@atelier/bench/notifiers/smsNotifier.cjs");
const { OrderRepository } = require("@atelier/bench/repositories/orderRepository.cjs");
const GrossProfitReport = require("@atelier/bench/reports/gross-profit.cjs");
const { RevenueService } = require("@atelier/bench/services/revenueService.cjs");
const { formatting } = require("@atelier/bench/concerns/hasFormatting.cjs");

describe("breadth subsystem", () => {
    it("registers every component", () => {
        assert.equal(REPORTS.length, 24);
        assert.equal(METRICS.length, 16);
    });

    it("keeps registry keys unique", () => {
        assert.equal(new Set(REPORTS.map((entry) => entry.slug)).size, REPORTS.length);
        assert.equal(new Set(METRICS.map((entry) => entry.key)).size, METRICS.length);
    });

    it("resolves a report through the static registry", () => {
        const data = Dataset.seeded();

        assert.equal(report("part-shortage").rows(data).length, 2);
        assert.equal(report("no-such-report"), undefined);
        assert.equal(metric("part-cost").compute(data), 46300);
    });

    it("resolves the same report through a dynamic require", () => {
        const Loaded = loadReport("gross-profit");

        assert.equal(Loaded, GrossProfitReport);
        assert.equal(new Loaded().slug, "gross-profit");
        assert.equal(loadReport("../dataset"), undefined);
    });

    it("matches the frozen seed", () => {
        const rows = new GrossProfitReport().rows(Dataset.seeded());

        assert.equal(rows[0].cents, 58325);
        assert.equal(rows[1].cents, 46300);
        assert.equal(rows[2].cents, 12025);
    });

    it("renders every report against the seed", () => {
        const data = Dataset.seeded();

        for (const entry of REPORTS) {
            assert.equal(entry.isEmpty(data), entry.rows(data).length === 0);
        }
    });

    it("shares one structural formatting concern", () => {
        assert.equal(formatting.formatValue(1.5), "1.50");
        assert.equal(formatting.formatLabel("  spaced  "), "spaced");
    });

    it("exports the same rows differently", () => {
        const rows = new GrossProfitReport().rows(Dataset.seeded());

        assert.ok(new CsvExporter().export(rows).startsWith("revenue,583.25"));
        assert.match(new JsonExporter().export(rows), /"label":"gross profit"/);
        assert.equal(new CsvExporter().filename("gross-profit"), "gross-profit.csv");
    });

    it("enforces the sms length cap", () => {
        const sms = new SmsNotifier();

        assert.throws(() => sms.send("subject", "x".repeat(200)), NotifyError);
        assert.equal(sms.send("subject", "short").channel, "sms");
    });

    it("refuses to send from an unconfigured transport", () => {
        assert.throws(() => new SmsNotifier("").send("s", "b"), /not configured/);
    });

    it("pins repository generics to concrete types", () => {
        const repo = new OrderRepository(Dataset.seeded().orders);

        assert.equal(repo.count(), 4);
        assert.ok(repo.find(1));
        assert.equal(repo.find(99), undefined);
        assert.equal(repo.open().length, 3);
    });

    it("sweeps the whole metric registry", () => {
        const sweep = new RevenueService().metricSweep(Dataset.seeded());

        assert.equal(sweep.length, 16);
        assert.ok(sweep.some(([key]) => key === "part-cost"));
    });
});
