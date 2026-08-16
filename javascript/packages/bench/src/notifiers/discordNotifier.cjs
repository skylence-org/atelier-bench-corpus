/** Discord webhook transport. */

const { AbstractNotifier } = require("../support/abstractNotifier.cjs");

/** Discord webhook transport. */
class DiscordNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static CHANNEL = "discord";

    /** @param {string} [endpoint] */
    constructor(endpoint = "https://discord.test/hook") {
        super(DiscordNotifier.CHANNEL, 2000, endpoint);
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

module.exports = { DiscordNotifier };
