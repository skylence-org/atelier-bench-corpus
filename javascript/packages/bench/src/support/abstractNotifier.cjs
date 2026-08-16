/**
 * Base shared by all 8 notifiers.
 *
 * Also the lane's `this`-rebinding site: an arrow function that keeps the
 * surrounding `this`, a plain function in the same method that does not and has
 * to be invoked with `.call`, and a method handed out pre-bound with `.bind`.
 */

const { NotifyError } = require("../contracts/notifierContract.cjs");
const { hasValidation } = require("../concerns/hasValidation.cjs");

class AbstractNotifier {
    /**
     * @param {string} channel
     * @param {number} maxBytes
     * @param {string} endpoint
     */
    constructor(channel, maxBytes, endpoint) {
        this.channel = channel;
        this.maxBytes = maxBytes;
        this.endpoint = endpoint;
    }

    /**
     * @param {string} subject
     * @param {string} body
     * @returns {import("../contracts/notifierContract.cjs").Delivery}
     */
    send(subject, body) {
        throw new TypeError(`${this.channel} does not implement send(${subject}, ${body.length} bytes)`);
    }

    /**
     * Shared precondition every transport runs before delivering.
     *
     * @param {string} subject
     * @param {string} body
     * @returns {void}
     */
    guard(subject, body) {
        if (!this.isConfigured()) {
            throw new NotifyError(this.channel, "not_configured", `channel ${this.channel} is not configured`);
        }

        if (subject.length + body.length > this.maxBytes) {
            throw new NotifyError(
                this.channel,
                "too_large",
                `payload for channel ${this.channel} exceeds ${this.maxBytes} bytes`,
            );
        }
    }

    /**
     * Render one line per subject.
     *
     * `quiet` is an arrow, so its `this` is this notifier. `loud` is a plain
     * function declaration: its `this` is undefined until `.call` supplies one.
     *
     * @param {readonly string[]} subjects
     * @returns {string[]}
     */
    describeAll(subjects) {
        const quiet = (subject) => `${this.channel}:${subject}`;

        function loud(subject) {
            return `${this.channel.toUpperCase()}:${subject}`;
        }

        return subjects.map((subject) => `${quiet(subject)} ${loud.call(this, subject)}`);
    }

    /**
     * A sender detached from the instance keeps working because it is bound.
     *
     * @returns {(subject: string, body: string) => import("../contracts/notifierContract.cjs").Delivery}
     */
    boundSender() {
        return this.send.bind(this);
    }

    /**
     * A transport with no endpoint configured is inert but not an error.
     *
     * @returns {boolean}
     */
    isConfigured() {
        return this.endpoint !== "";
    }

    /** @returns {readonly import("../concerns/hasValidation.cjs").Violation[]} */
    validate() {
        return this.isConfigured() ? [] : [{ field: "endpoint", message: "endpoint is empty" }];
    }
}

// isValid / firstViolation arrive from the mixin; validate above wins over it.
Object.assign(AbstractNotifier.prototype, hasValidation, {
    validate: AbstractNotifier.prototype.validate,
});

module.exports = { AbstractNotifier };
