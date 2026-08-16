/** SMS transport with the classic length cap. */

import type { Delivery } from "../contracts/notifierContract";
import { AbstractNotifier } from "../support/abstractNotifier";

/** SMS transport with the classic length cap. */
export class SmsNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static readonly CHANNEL = "sms";

    constructor(endpoint = "https://sms.test/send") {
        super(SmsNotifier.CHANNEL, 160, endpoint);
    }

    override send(subject: string, body: string): Delivery {
        this.guard(subject, body);

        return { channel: this.channel, reference: `${this.channel}:${subject}` };
    }
}
