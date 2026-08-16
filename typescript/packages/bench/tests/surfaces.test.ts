import { describe, expect, it } from "vitest";

import { Left } from "@atelier/core";

import { Dataset } from "../src/dataset";
import { DailyRevenueReport } from "../src/reports/dailyRevenueReport";
import { RULES } from "../src/rules";
import { Adhoc, namedAdhoc } from "../src/support/adhoc";
import { reportFlags } from "../src/support/flags";
import { lowWeight, weightOf } from "../src/support/keyedLookup";
import { LoggedRuleRunner } from "../src/support/logged";
import { describeLeft } from "../src/support/pairConsumer";
import { defaultSeverity, severityLabel } from "../src/support/severity";
import { cashFlowSlug } from "../src/support/slug";
import { unwrappedOrderCount } from "../src/support/unwrap";

describe("failure-mode surfaces (issue #9) behave at runtime", () => {
    it("registers all 48 rules and every rule passes on the seeded dataset", () => {
        const data = Dataset.seeded();

        expect(RULES).toHaveLength(48);
        expect(new Set(RULES.map((rule) => rule.key)).size).toBe(48);
        expect(RULES.every((rule) => rule.evaluate(data))).toBe(true);
    });

    it("makes DailyRevenueReport the composite implementor without adding a report", () => {
        const report = new DailyRevenueReport();

        expect(report.nextRunSeconds(90_000)).toBe(172_800);
        expect(report.isCacheable()).toBe(true);
        expect(report.logLine("x")).toBe("[daily-revenue] x");
    });

    it("keeps the breadth constructs' values", () => {
        expect(unwrappedOrderCount).toBe(4);
        expect(reportFlags).toEqual({ cacheable: true, billable: true });
        expect(cashFlowSlug).toBe("cash-flow-report");
        expect(severityLabel(defaultSeverity)).toBe("medium");
        expect(namedAdhoc).toBeInstanceOf(Adhoc);
        expect(weightOf("high")).toBeGreaterThan(lowWeight);
        expect(new LoggedRuleRunner().run(1)).toBe(2);
        expect(describeLeft(new Left("left-hand"))).toBe("left-hand");
    });
});
