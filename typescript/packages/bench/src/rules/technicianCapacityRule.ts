/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class TechnicianCapacityRule implements RuleContract {
    readonly key = "technician-capacity";

    evaluate(data: Dataset): boolean {
        return data.technicians.length >= 1;
    }
}
