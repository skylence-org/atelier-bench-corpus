/** Base for reports that also run on a cadence. */

const { Cadence } = require("../contracts/scheduleContract.cjs");
const { AbstractReport } = require("./abstractReport.cjs");

class AbstractPeriodicReport extends AbstractReport {
    /**
     * @param {string} slug
     * @param {string} title
     * @param {import("../contracts/scheduleContract.cjs").CadenceValue} cadence
     */
    constructor(slug, title, cadence) {
        super(slug, title);
        this.cadence = cadence;
    }

    /**
     * Next run instant, aligned to the cadence grid.
     *
     * @param {number} now
     * @returns {number}
     */
    nextRunSeconds(now) {
        const period = Cadence.seconds(this.cadence);

        return now - (now % period) + period;
    }
}

module.exports = { AbstractPeriodicReport };
