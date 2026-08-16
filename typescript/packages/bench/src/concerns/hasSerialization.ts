/** JSON rendering for any structurally serialisable value. */

export interface HasSerialization {
    toJson(): string;
    toPrettyJson(): string;
}

/** Generic helper: works on anything, no interface implementation required. */
export function toJson(value: unknown): string {
    return JSON.stringify(value) ?? "null";
}

export function toPrettyJson(value: unknown): string {
    return JSON.stringify(value, null, 4) ?? "null";
}
