/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class RushSurchargeRule implements RuleContract {
    readonly key = "rush-surcharge";

    evaluate(data: Dataset): boolean {
        return data.orders.length >= 1;
    }
}
