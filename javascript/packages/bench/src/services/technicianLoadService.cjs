/** Bench load. */

const { AbstractService } = require("../support/abstractService.cjs");

/** Bench load. */
class TechnicianLoadService extends AbstractService {
    /** Service name, used as the audit actor. */
    static NAME = "technician-load";

    constructor() {
        super(TechnicianLoadService.NAME);
    }

    /**
     * Mean booked share across the bench.
     *
     * @param {import("../dataset.cjs").Dataset} data
     * @returns {number}
     */
    meanUtilisation(data) {
        if (data.technicians.length === 0) {
            return 0;
        }

        return data.technicians.reduce((sum, t) => sum + t.utilisation(), 0) / data.technicians.length;
    }
}

module.exports = { TechnicianLoadService };
