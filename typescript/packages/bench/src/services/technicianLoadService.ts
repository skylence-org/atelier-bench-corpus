/** Bench utilisation. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Bench utilisation. */
export class TechnicianLoadService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "technician-load";

    constructor() {
        super(TechnicianLoadService.NAME);
    }

    /** Mean booked share across the bench. */
    meanUtilisation(data: Dataset): number {
        if (data.technicians.length === 0) {
            return 0;
        }

        return data.technicians.reduce((sum, t) => sum + t.utilisation(), 0) / data.technicians.length;
    }
}
