/**
 * Shared identity for every component in the lane.
 *
 * The direct analogue of the php lane's AbstractComponent. `logTarget()` and
 * `logLine()` are not declared here: they arrive from the `hasLogging` mixin
 * copied onto the prototype below.
 */

const { hasLogging } = require("../concerns/hasLogging.cjs");

class AbstractComponent {
    /**
     * @param {string} slug
     * @param {string} title
     */
    constructor(slug, title) {
        if (new.target === AbstractComponent) {
            throw new TypeError("AbstractComponent is a base, not a component");
        }

        this.slug = slug;
        this.title = title;
    }
}

Object.assign(AbstractComponent.prototype, hasLogging);

module.exports = { AbstractComponent };
