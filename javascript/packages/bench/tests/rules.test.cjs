const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const { Dataset, RULES, RuleRegistry, isRuleContract } = require("@atelier/bench");
const { CompositeContract } = require("@atelier/bench/contracts/compositeContract.cjs");
const { NOMINAL_RULES } = require("@atelier/bench/rules/index.cjs");
const { STRUCTURAL_RULES } = require("@atelier/bench/rules/structural.cjs");
const MinimumStockRule = require("@atelier/bench/rules/minimum-stock.cjs");
const { AbstractCompositeReport } = require("@atelier/bench/support/abstractCompositeReport.cjs");
const { AbstractPeriodicReport } = require("@atelier/bench/support/abstractPeriodicReport.cjs");

describe("rule registry", () => {
    it("holds 48 implementors, half nominal and half structural", () => {
        assert.equal(RULES.length, 48);
        assert.equal(NOMINAL_RULES.length, 24);
        assert.equal(STRUCTURAL_RULES.length, 24);
        assert.equal(new Set(RULES.map((rule) => rule.key)).size, 48);
    });

    it("satisfies every rule on the frozen seed", () => {
        const data = Dataset.seeded();

        assert.equal(RuleRegistry.satisfied(data).length, 48);
        assert.ok(RULES.every(isRuleContract));
    });

    it("keeps the class half addressable by name", () => {
        assert.equal(MinimumStockRule.KEY, "minimum-stock");
        assert.equal(new MinimumStockRule().key, "minimum-stock");
        assert.ok(RuleRegistry.rule("gross-profit").evaluate(Dataset.seeded()));
        assert.equal(RuleRegistry.rule("no-such-rule"), undefined);
    });
});

describe("multi-parent shapes", () => {
    it("counts three parents on the composite contract", () => {
        const composite = new CompositeContract("audit", "Audit", "hourly");

        assert.equal(composite.parents().length, 3);
        assert.equal(composite.cacheKey(), "composite:audit");
        assert.ok(composite.isCacheable());
        assert.equal(composite.nextRunSeconds(0), 3600);
        assert.equal(composite.logLine("ready"), "[audit] ready");
    });

    it("counts one extends plus two mixins on the composite report", () => {
        assert.ok(AbstractCompositeReport.prototype instanceof AbstractPeriodicReport);
        assert.ok(Object.hasOwn(AbstractCompositeReport.prototype, "auditTrail"));
        assert.ok(Object.hasOwn(AbstractCompositeReport.prototype, "metaKeys"));
        assert.ok(!Object.hasOwn(AbstractCompositeReport.prototype, "nextRunSeconds"));
    });
});
