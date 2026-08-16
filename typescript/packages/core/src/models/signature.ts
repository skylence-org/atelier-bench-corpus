/** Collection signature: at most one per order. */

export class Signature {
    constructor(
        readonly id: number,
        readonly repairOrderId: number,
        readonly signedBy: string,
        readonly svgPath = "",
    ) {}

    isCaptured(): boolean {
        return this.svgPath !== "";
    }
}
