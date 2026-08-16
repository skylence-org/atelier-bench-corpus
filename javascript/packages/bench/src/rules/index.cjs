/**
 * The rule registry: 48 implementors of one contract.
 *
 * 24 of them are classes, one per file, required by key. The other 24 are the
 * object literals in `./structural.cjs`. Both halves answer `evaluate(data)`,
 * and only the first half has a class name to report.
 */

const { STRUCTURAL_RULES } = require("./structural.cjs");

/** Keys of the nominal half, in registry order; each one is also its filename. */
const NOMINAL_KEYS = [
    "minimum-stock",
    "maximum-backlog",
    "warranty-window",
    "rush-surcharge",
    "technician-capacity",
    "part-availability",
    "invoice-balance",
    "customer-credit",
    "device-age",
    "repair-duration",
    "rework-limit",
    "discount-ceiling",
    "deposit-required",
    "label-presence",
    "note-required",
    "signature-required",
    "priority-escalation",
    "status-sequence",
    "part-cost-margin",
    "revenue-floor",
    "gross-profit",
    "schedule-gap",
    "slot-overbooking",
    "idle-technician",
];

/**
 * The same 24 modules, statically required in registry order, so every rule
 * class is reachable without executing the registry. `NOMINAL_KEYS` stays the
 * authoritative key order (the tests assert the two agree); the dynamic-require
 * edge of this lane lives in the report registry, `../index.cjs` `loadReport()`.
 */
const NOMINAL_CLASSES = [
    require("./minimum-stock.cjs"),
    require("./maximum-backlog.cjs"),
    require("./warranty-window.cjs"),
    require("./rush-surcharge.cjs"),
    require("./technician-capacity.cjs"),
    require("./part-availability.cjs"),
    require("./invoice-balance.cjs"),
    require("./customer-credit.cjs"),
    require("./device-age.cjs"),
    require("./repair-duration.cjs"),
    require("./rework-limit.cjs"),
    require("./discount-ceiling.cjs"),
    require("./deposit-required.cjs"),
    require("./label-presence.cjs"),
    require("./note-required.cjs"),
    require("./signature-required.cjs"),
    require("./priority-escalation.cjs"),
    require("./status-sequence.cjs"),
    require("./part-cost-margin.cjs"),
    require("./revenue-floor.cjs"),
    require("./gross-profit.cjs"),
    require("./schedule-gap.cjs"),
    require("./slot-overbooking.cjs"),
    require("./idle-technician.cjs"),
];

/** @type {readonly import("../contracts/ruleContract.cjs").RuleContract[]} */
const NOMINAL_RULES = NOMINAL_CLASSES.map((Rule) => new Rule());

/**
 * Every rule in the lane: nominal half first, structural half second.
 *
 * @type {readonly import("../contracts/ruleContract.cjs").RuleContract[]}
 */
const RULES = [...NOMINAL_RULES, ...STRUCTURAL_RULES];

/** Lookup over {@link RULES}. */
class RuleRegistry {
    /** The whole registry, as a static member. */
    static RULES = RULES;

    /**
     * @param {string} key
     * @returns {import("../contracts/ruleContract.cjs").RuleContract | undefined}
     */
    static rule(key) {
        return RULES.find((candidate) => candidate.key === key);
    }

    /**
     * Rules that hold on `data`.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {readonly string[]}
     */
    static satisfied(data) {
        return RULES.filter((rule) => rule.evaluate(data)).map((rule) => rule.key);
    }
}

module.exports.NOMINAL_CLASSES = NOMINAL_CLASSES;
module.exports.NOMINAL_KEYS = NOMINAL_KEYS;
module.exports.NOMINAL_RULES = NOMINAL_RULES;
module.exports.RULES = RULES;
module.exports.RuleRegistry = RuleRegistry;
