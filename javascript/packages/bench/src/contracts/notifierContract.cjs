/** Outbound channels. */

/**
 * Receipt handed back by a successful send.
 *
 * @typedef {object} Delivery
 * @property {string} channel
 * @property {string} reference
 */

/**
 * One outbound transport.
 *
 * @typedef {object} NotifierContract
 * @property {string} channel
 * @property {number} maxBytes Largest payload this transport accepts.
 * @property {(subject: string, body: string) => Delivery} send
 */

/** Why a send did not happen. */
class NotifyError extends Error {
    /**
     * @param {string} channel
     * @param {"not_configured" | "too_large"} reason
     * @param {string} message
     */
    constructor(channel, reason, message) {
        super(message);
        this.name = "NotifyError";
        this.channel = channel;
        this.reason = reason;
    }
}

module.exports = { NotifyError };
