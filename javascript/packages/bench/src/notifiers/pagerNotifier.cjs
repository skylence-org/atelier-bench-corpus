/** On-call pager transport. */

const { AbstractNotifier } = require("../support/abstractNotifier.cjs");

/** On-call pager transport. */
class PagerNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static CHANNEL = "pager";

    /** @param {string} [endpoint] */
    constructor(endpoint = "https://pager.test/v2") {
        super(PagerNotifier.CHANNEL, 512, endpoint);
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

module.exports = { PagerNotifier };
