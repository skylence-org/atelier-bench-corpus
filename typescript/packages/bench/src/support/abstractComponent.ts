/**
 * Shared identity for every component in the lane.
 *
 * Abstract base: the direct analogue of the php lane's AbstractComponent, and
 * the shape Rust had to express through composition instead.
 */

import type { HasLogging } from "../concerns/hasLogging";

export abstract class AbstractComponent implements HasLogging {
    protected constructor(
        readonly slug: string,
        readonly title: string,
    ) {}

    logTarget(): string {
        return this.slug;
    }

    logLine(message: string): string {
        return `[${this.logTarget()}] ${message}`;
    }
}
