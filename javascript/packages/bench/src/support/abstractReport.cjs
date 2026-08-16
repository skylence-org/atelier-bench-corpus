/**
 * Base shared by all 24 reports.
 *
 * One `extends` edge (AbstractComponent) plus the cache behaviour mixed onto
 * the prototype; `rows` is the only thing a subclass must write.
 */

const { AbstractComponent } = require("./abstractComponent.cjs");
const { cacheableContract } = require("../contracts/cacheableContract.cjs");
const { hasCache } = require("../concerns/hasCache.cjs");

class AbstractReport extends AbstractComponent {
    /** Decimals every report footer renders with. */
    static DEFAULT_DECIMALS = 2;

    /**
     * @param {string} slug
     * @param {string} title
     */
    constructor(slug, title) {
        super(slug, title);
        this.decimals = AbstractReport.DEFAULT_DECIMALS;
        this.cacheNamespace = "reports";
    }

    /**
     * Every subclass renders its own body; everything else is inherited.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {import("../contracts/reportContract.cjs").ReportRow[]}
     */
    rows(data) {
        throw new TypeError(`${this.slug} does not implement rows(${typeof data})`);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    total(data) {
        return this.rows(data).reduce((sum, row) => sum + row.value, 0);
    }

    /**
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {boolean}
     */
    isEmpty(data) {
        return this.rows(data).length === 0;
    }
}

Object.assign(AbstractReport.prototype, hasCache, cacheableContract);

module.exports = { AbstractReport };
