/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class CustomerCreditRule implements RuleContract {
    readonly key = "customer-credit";

    evaluate(data: Dataset): boolean {
        return data.customers.length >= 1;
    }
}
