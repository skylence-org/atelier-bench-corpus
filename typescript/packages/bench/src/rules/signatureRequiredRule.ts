/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class SignatureRequiredRule implements RuleContract {
    readonly key = "signature-required";

    evaluate(data: Dataset): boolean {
        return data.customers.length >= 1;
    }
}
