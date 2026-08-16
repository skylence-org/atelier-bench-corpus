/** Margin after part cost. */

import type { Dataset } from "../dataset";
import { AbstractService } from "../support/abstractService";

/** Margin after part cost. */
export class ProfitMarginService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "profit-margin";

    constructor() {
        super(ProfitMarginService.NAME);
    }

    /** Margin as a share of revenue. */
    ratio(data: Dataset): number {
        const revenue = data.revenueCents();

        return revenue === 0 ? 0 : (revenue - data.partsCostCents()) / revenue;
    }
}
