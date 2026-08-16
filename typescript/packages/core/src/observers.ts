/** Model observers. */

import type { Device } from "./models/device";

/** Lifecycle hooks for {@link Device}; the app registers one implementor. */
export interface DeviceObserver {
    created(device: Device): void;
    updated?(device: Device): void;
    deleted?(device: Device): void;
}

/** Writes an audit line whenever a device appears. */
export class AuditingDeviceObserver implements DeviceObserver {
    readonly lines: string[] = [];

    created(device: Device): void {
        this.lines.push(`device.created ${device.label()}`);
    }

    deleted(device: Device): void {
        this.lines.push(`device.deleted ${device.label()}`);
    }
}
