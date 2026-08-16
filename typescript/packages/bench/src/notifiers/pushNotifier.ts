/** Mobile push transport. */

import type { Delivery } from "../contracts/notifierContract";
import { AbstractNotifier } from "../support/abstractNotifier";

/** Mobile push transport. */
export class PushNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static readonly CHANNEL = "push";

    constructor(endpoint = "https://push.test/send") {
        super(PushNotifier.CHANNEL, 1024, endpoint);
    }

    override send(subject: string, body: string): Delivery {
        this.guard(subject, body);

        return { channel: this.channel, reference: `${this.channel}:${subject}` };
    }
}
