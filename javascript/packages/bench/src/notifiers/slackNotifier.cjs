/** Slack webhook transport. */

const { AbstractNotifier } = require("../support/abstractNotifier.cjs");

/** Slack webhook transport. */
class SlackNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static CHANNEL = "slack";

    /** @param {string} [endpoint] */
    constructor(endpoint = "https://slack.test/hook") {
        super(SlackNotifier.CHANNEL, 3000, endpoint);
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

module.exports = { SlackNotifier };
