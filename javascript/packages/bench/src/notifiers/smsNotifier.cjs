/** SMS transport with the tightest cap. */

const { AbstractNotifier } = require("../support/abstractNotifier.cjs");

/** SMS transport with the tightest cap. */
class SmsNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static CHANNEL = "sms";

    /** @param {string} [endpoint] */
    constructor(endpoint = "https://sms.test/send") {
        super(SmsNotifier.CHANNEL, 160, endpoint);
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

module.exports = { SmsNotifier };
