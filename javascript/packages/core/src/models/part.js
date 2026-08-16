/** Stock part. */

/** @typedef {import("../money.js").Money} Money */

export class Part {
    /**
     * @param {number} id
     * @param {string} sku
     * @param {string} name
     * @param {Money} unitPrice
     * @param {number} [stock]
     * @param {number} [reorderLevel]
     */
    constructor(id, sku, name, unitPrice, stock = 0, reorderLevel = 2) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.unitPrice = unitPrice;
        this.stock = stock;
        this.reorderLevel = reorderLevel;
        this.consumed = 0;
    }

    /**
     * Units consumed by completed orders since the last stock count.
     *
     * @returns {number}
     */
    consumedQuantity() {
        return this.consumed;
    }

    /**
     * Below the reorder level the part shows up on the shortage report.
     *
     * @returns {boolean}
     */
    isLowStock() {
        return this.stock <= this.reorderLevel;
    }

    /**
     * @param {number} quantity
     * @returns {Money}
     */
    extendedPrice(quantity) {
        return this.unitPrice.times(quantity);
    }

    /**
     * @param {number} quantity
     * @returns {boolean}
     */
    consume(quantity) {
        if (quantity > this.stock) {
            return false;
        }

        this.stock -= quantity;
        this.consumed += quantity;

        return true;
    }
}
