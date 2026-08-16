/** Collection signature: at most one per order. */

export class Signature {
    /**
     * @param {number} id
     * @param {number} repairOrderId
     * @param {string} signedBy
     * @param {string} [svgPath]
     */
    constructor(id, repairOrderId, signedBy, svgPath = "") {
        this.id = id;
        this.repairOrderId = repairOrderId;
        this.signedBy = signedBy;
        this.svgPath = svgPath;
    }

    /** @returns {boolean} */
    isCaptured() {
        return this.svgPath !== "";
    }
}
