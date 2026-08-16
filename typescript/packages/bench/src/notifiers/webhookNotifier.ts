/** Generic JSON webhook transport. */

import type { Delivery } from "../contracts/notifierContract";
import { AbstractNotifier } from "../support/abstractNotifier";

/** Generic JSON webhook transport. */
export class WebhookNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static readonly CHANNEL = "webhook";

    constructor(endpoint = "https://hooks.test/generic") {
        super(WebhookNotifier.CHANNEL, 8192, endpoint);
    }

    override send(subject: string, body: string): Delivery {
        this.guard(subject, body);

        return { channel: this.channel, reference: `${this.channel}:${subject}` };
    }
}
