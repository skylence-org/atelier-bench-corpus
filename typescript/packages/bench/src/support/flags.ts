/** Mapped type: build a boolean flag per key of a union. */

export type Flags<K extends string> = { [P in K]: boolean };

export const reportFlags: Flags<"cacheable" | "billable"> = {
    cacheable: true,
    billable: true,
};
