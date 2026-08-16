/** Base shared by all 8 notifiers. */

import { NotifyError, type Delivery, type NotifierContract } from "../contracts/notifierContract";
import type { HasValidation, Violation } from "../concerns/hasValidation";

export abstract class AbstractNotifier implements NotifierContract, HasValidation {
    protected constructor(
        readonly channel: string,
        readonly maxBytes: number,
        readonly endpoint: string,
    ) {}

    abstract send(subject: string, body: string): Delivery;

    /** Shared precondition every transport runs before delivering. */
    protected guard(subject: string, body: string): void {
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

    /** A transport with no endpoint configured is inert but not an error. */
    isConfigured(): boolean {
        return this.endpoint !== "";
    }

    validate(): readonly Violation[] {
        return this.isConfigured() ? [] : [{ field: "endpoint", message: "endpoint is empty" }];
    }

    isValid(): boolean {
        return this.validate().length === 0;
    }

    firstViolation(): Violation | undefined {
        return this.validate()[0];
    }
}
