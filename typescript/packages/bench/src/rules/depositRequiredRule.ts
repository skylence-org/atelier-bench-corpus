/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class DepositRequiredRule implements RuleContract {
    readonly key = "deposit-required";

    evaluate(data: Dataset): boolean {
        return data.invoices.length >= 1;
    }
}
