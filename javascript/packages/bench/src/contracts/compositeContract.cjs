/**
 * Three parents, one class.
 *
 * `AbstractComponent` arrives through `extends`; `cacheableContract` and
 * `scheduleContract` are copied onto the prototype with `Object.assign`. All
 * three are parents of `CompositeContract`, and only the first one is visible
 * at the class declaration line.
 */

const { AbstractComponent } = require("../support/abstractComponent.cjs");
const { cacheableContract } = require("./cacheableContract.cjs");
const { Cadence, scheduleContract } = require("./scheduleContract.cjs");

class CompositeContract extends AbstractComponent {
    /**
     * @param {string} slug
     * @param {string} title
     * @param {import("./scheduleContract.cjs").CadenceValue} [cadence]
     */
    constructor(slug, title, cadence = Cadence.Daily) {
        super(slug, title);
        this.cadence = cadence;
        this.cacheNamespace = "composite";
    }

    /**
     * Names of the three contracts this class satisfies, in parent order.
     *
     * @returns {readonly string[]}
     */
    parents() {
        return ["AbstractComponent", "cacheableContract", "scheduleContract"];
    }
}

Object.assign(CompositeContract.prototype, cacheableContract, scheduleContract);

module.exports = { CompositeContract };
