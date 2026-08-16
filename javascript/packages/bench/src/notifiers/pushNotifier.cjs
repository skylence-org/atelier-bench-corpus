/** Mobile push transport. */

const { AbstractNotifier } = require("../support/abstractNotifier.cjs");

/** Mobile push transport. */
class PushNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static CHANNEL = "push";

    /** @param {string} [endpoint] */
    constructor(endpoint = "https://push.test/send") {
        super(PushNotifier.CHANNEL, 1024, endpoint);
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

module.exports = { PushNotifier };
