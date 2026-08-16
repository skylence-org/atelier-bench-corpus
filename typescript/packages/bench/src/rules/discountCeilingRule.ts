/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class DiscountCeilingRule implements RuleContract {
    readonly key = "discount-ceiling";

    evaluate(data: Dataset): boolean {
        return data.revenueCents() > 0;
    }
}
