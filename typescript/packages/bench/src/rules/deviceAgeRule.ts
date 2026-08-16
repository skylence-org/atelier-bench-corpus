/** Cardinality fixture: nominal (class, `implements`) implementor of RuleContract. */

import type { RuleContract } from "../contracts/ruleContract";
import type { Dataset } from "../dataset";

export class DeviceAgeRule implements RuleContract {
    readonly key = "device-age";

    evaluate(data: Dataset): boolean {
        return data.devices.length >= 1;
    }
}
