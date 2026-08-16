/** Warranty intake share. */

import type { Dataset } from "../dataset";
import { Priority } from "@atelier/core";
import { AbstractService } from "../support/abstractService";

/** Warranty intake share. */
export class WarrantyClaimService extends AbstractService {
    /** Service name, used as the audit actor. */
    static readonly NAME = "warranty-claim";

    constructor() {
        super(WarrantyClaimService.NAME);
    }

    /** Orders taken in under warranty. */
    count(data: Dataset): number {
        return data.orders.filter((order) => order.priority === Priority.Warranty).length;
    }
}
