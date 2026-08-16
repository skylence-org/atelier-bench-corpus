/** Slack webhook transport. */

import type { Delivery } from "../contracts/notifierContract";
import { AbstractNotifier } from "../support/abstractNotifier";

/** Slack webhook transport. */
export class SlackNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static readonly CHANNEL = "slack";

    constructor(endpoint = "https://slack.test/hook") {
        super(SlackNotifier.CHANNEL, 3000, endpoint);
    }

    override send(subject: string, body: string): Delivery {
        this.guard(subject, body);

        return { channel: this.channel, reference: `${this.channel}:${subject}` };
    }
}
