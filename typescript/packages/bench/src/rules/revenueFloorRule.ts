/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class RevenueFloorRule implements RuleContract {
    readonly key = "revenue-floor";

    evaluate(data: Dataset): boolean {
        return data.revenueCents() > 0;
    }
}
