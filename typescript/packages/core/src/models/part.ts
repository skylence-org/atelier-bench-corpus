/** Stock part. */

import { Money } from "../money";

export class Part {
    consumed = 0;

    constructor(
        readonly id: number,
        readonly sku: string,
        readonly name: string,
        readonly unitPrice: Money,
        public stock = 0,
        readonly reorderLevel = 2,
    ) {}

    /** Units consumed by completed orders since the last stock count. */
    consumedQuantity(): number {
        return this.consumed;
    }

    /** Below the reorder level the part shows up on the shortage report. */
    isLowStock(): boolean {
        return this.stock <= this.reorderLevel;
    }

    extendedPrice(quantity: number): Money {
        return this.unitPrice.times(quantity);
    }

    consume(quantity: number): boolean {
        if (quantity > this.stock) {
            return false;
        }

        this.stock -= quantity;
        this.consumed += quantity;

        return true;
    }
}
