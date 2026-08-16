/**
 * Log-line prefixing.
 *
 * A mixin object: `Object.assign(Target.prototype, hasLogging)` installs both
 * methods, so neither has a declaration in the class that uses them.
 */

/**
 * @typedef {object} HasLogging
 * @property {() => string} logTarget Target segment written in front of every line.
 * @property {(message: string) => string} logLine
 */

/** @type {HasLogging} */
const hasLogging = {
    /** @returns {string} */
    logTarget() {
        return this.slug ?? this.key ?? this.name ?? "component";
    },

    /**
     * @param {string} message
     * @returns {string}
     */
    logLine(message) {
        return `[${this.logTarget()}] ${message}`;
    },
};

module.exports = { hasLogging };
