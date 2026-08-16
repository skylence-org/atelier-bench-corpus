/** SMTP transport. */

const { AbstractNotifier } = require("../support/abstractNotifier.cjs");

/** SMTP transport. */
class EmailNotifier extends AbstractNotifier {
    /** Channel name reported on every delivery receipt. */
    static CHANNEL = "email";

    /** @param {string} [endpoint] */
    constructor(endpoint = "smtp://mail.test:25") {
        super(EmailNotifier.CHANNEL, 65536, endpoint);
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

module.exports = { EmailNotifier };
