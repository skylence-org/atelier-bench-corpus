/** Generic webhook transport. */

const { AbstractNotifier } = require("../support/abstractNotifier.cjs");

/** Generic webhook transport. */
class WebhookNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static CHANNEL = "webhook";

    /** @param {string} [endpoint] */
    constructor(endpoint = "https://hooks.test/generic") {
        super(WebhookNotifier.CHANNEL, 8192, endpoint);
    }

    /**
     * @param {string} subject
     * @param {string} body
     * @returns {import("../contracts/notifierContract.cjs").Delivery}
     */
    send(subject, body) {
        this.guard(subject, body);

        return { channel: this.channel, reference: `${this.channel}:${subject}` };
    }
}

module.exports = { WebhookNotifier };
