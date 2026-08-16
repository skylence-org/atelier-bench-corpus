/** Model observers. */

/**
 * Lifecycle hooks for a device; the app registers one implementor.
 *
 * @typedef {object} DeviceObserver
 * @property {(device: import("./models/device.js").Device) => void} created
 * @property {((device: import("./models/device.js").Device) => void) | undefined} [deleted]
 */

/** Writes an audit line whenever a device appears. */
export class AuditingDeviceObserver {
    constructor() {
        /** @type {string[]} */
        this.lines = [];
    }

    /**
     * @param {import("./models/device.js").Device} device
     * @returns {void}
     */
    created(device) {
        this.lines.push(`device.created ${device.label()}`);
    }

    /**
     * @param {import("./models/device.js").Device} device
     * @returns {void}
     */
    deleted(device) {
        this.lines.push(`device.deleted ${device.label()}`);
    }
}
