/** Microsoft Teams webhook transport. */

import type { Delivery } from "../contracts/notifierContract";
import { AbstractNotifier } from "../support/abstractNotifier";

/** Microsoft Teams webhook transport. */
export class TeamsNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static readonly CHANNEL = "teams";

    constructor(endpoint = "https://teams.test/hook") {
        super(TeamsNotifier.CHANNEL, 4096, endpoint);
    }

    override send(subject: string, body: string): Delivery {
        this.guard(subject, body);

        return { channel: this.channel, reference: `${this.channel}:${subject}` };
    }
}
