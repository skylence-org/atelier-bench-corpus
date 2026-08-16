/** Part consumption roll-up. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Part consumption roll-up. */
export class PartUsageService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "part-usage";

    constructor() {
        super(PartUsageService.NAME);
    }

    /** Units consumed across the whole catalogue. */
    consumedUnits(data: Dataset): number {
        return data.parts.reduce((total, part) => total + part.consumedQuantity(), 0);
    }
}
