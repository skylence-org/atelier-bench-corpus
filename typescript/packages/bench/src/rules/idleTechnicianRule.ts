/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class IdleTechnicianRule implements RuleContract {
    readonly key = "idle-technician";

    evaluate(data: Dataset): boolean {
        return data.technicians.length >= 1;
    }
}
