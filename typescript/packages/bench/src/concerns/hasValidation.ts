/** Field-level validation. */

/** One failed rule. */
export interface Violation {
    readonly field: string;
    readonly message: string;
}

export interface HasValidation {
    /** Every rule that currently fails. */
    validate(): readonly Violation[];

    isValid(): boolean;
    firstViolation(): Violation | undefined;
}
