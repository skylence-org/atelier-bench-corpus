/** Device brought in for repair. */

export class Device {
    constructor(
        readonly id: number,
        readonly customerId: number,
        readonly brand: string,
        readonly model: string,
        readonly serial?: string,
    ) {}

    /** Human label such as `Framework 13 (SER-0001)`. */
    label(): string {
        return this.serial === undefined
            ? `${this.brand} ${this.model}`
            : `${this.brand} ${this.model} (${this.serial})`;
    }

    /** Devices without a serial cannot be warranty-claimed. */
    isWarrantyEligible(): boolean {
        return this.serial !== undefined;
    }
}
