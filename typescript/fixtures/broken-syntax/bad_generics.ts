// DO NOT FIX. Intentionally invalid: unbalanced generics, truncated extends constraint.

export class Holder<T, U {
    constructor(
        readonly left: T,
        readonly right: U,
    ) {}
}

export function merge<T extends>(left: T, right: T): Array<T {
    return [left, right];
}
