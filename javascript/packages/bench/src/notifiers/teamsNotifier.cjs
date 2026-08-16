/** Teams webhook transport. */

const { AbstractNotifier } = require("../support/abstractNotifier.cjs");

/** Teams webhook transport. */
class TeamsNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static CHANNEL = "teams";

    /** @param {string} [endpoint] */
    constructor(endpoint = "https://teams.test/hook") {
        super(TeamsNotifier.CHANNEL, 4096, endpoint);
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

module.exports = { TeamsNotifier };
