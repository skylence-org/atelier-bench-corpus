/** SMTP transport. */

import type { Delivery } from "../contracts/notifierContract";
import { AbstractNotifier } from "../support/abstractNotifier";

/** SMTP transport. */
export class EmailNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static readonly CHANNEL = "email";

    constructor(endpoint = "smtp://mail.test:25") {
        super(EmailNotifier.CHANNEL, 65536, endpoint);
    }

    override send(subject: string, body: string): Delivery {
        this.guard(subject, body);

        return { channel: this.channel, reference: `${this.channel}:${subject}` };
    }
}
