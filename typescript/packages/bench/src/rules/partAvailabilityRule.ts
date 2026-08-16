/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class PartAvailabilityRule implements RuleContract {
    readonly key = "part-availability";

    evaluate(data: Dataset): boolean {
        return data.parts.length >= 1;
    }
}
