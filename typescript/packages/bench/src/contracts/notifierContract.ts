/** Outbound channels. */

/** Receipt handed back by a successful send. */
export interface Delivery {
    readonly channel: string;
    readonly reference: string;
}

/** Why a send did not happen. */
export class NotifyError extends Error {
    constructor(
        readonly channel: string,
        readonly reason: "not_configured" | "too_large",
        message: string,
    ) {
        super(message);
        this.name = "NotifyError";
    }
}

/** One outbound transport. */
export interface NotifierContract {
    readonly channel: string;

    /** Largest payload this transport accepts. */
    readonly maxBytes: number;

    send(subject: string, body: string): Delivery;
}
