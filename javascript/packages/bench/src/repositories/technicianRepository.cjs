/** Read side over the bench. */

/**
 * A technician row, as built by `makeTechnician`.
 *
 * @typedef {object} Technician
 * @property {number} id
 * @property {string} name
 * @property {() => number | undefined} nextSlot
 */
/**
 * Read side over the bench.
 *
 * Pins the generic storage contract to concrete types: `Id` is `number` and
 * `Rec` is `Technician`.
 *
 * @type {import("@atelier/core/contracts/repository.js").Repository<number, Technician>}
 */
class TechnicianRepository {
    /** @param {readonly Technician[]} [records] */
    constructor(records = []) {
        this.records = records;
    }

    /**
     * @param {number} id
     * @returns {Technician | undefined}
     */
    find(id) {
        return this.records.find((record) => record.id === id);
    }

    /** @returns {readonly Technician[]} */
    all() {
        return this.records;
    }

    /** @returns {number} */
    count() {
        return this.records.length;
    }

    /**
     * Technicians with head-room left today.
     *
     * @returns {readonly Technician[]}
     */
    available() {
        return this.records.filter((technician) => technician.nextSlot() !== undefined);
    }
}

module.exports = { TechnicianRepository };
