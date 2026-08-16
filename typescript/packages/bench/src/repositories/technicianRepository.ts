/** Read side over the bench roster. */

import type { Repository } from "@atelier/core";
import type { Technician } from "@atelier/core";

/** Read side over the bench roster. */
export class TechnicianRepository implements Repository<number, Technician> {
    constructor(private readonly records: readonly Technician[] = []) {}

    find(id: number): Technician | undefined {
        return this.records.find((record) => record.id === id);
    }

    all(): readonly Technician[] {
        return this.records;
    }

    count(): number {
        return this.records.length;
    }

    /** Technicians with head-room left today. */
    available(): readonly Technician[] {
        return this.records.filter((technician) => technician.nextSlot() !== undefined);
    }
}
