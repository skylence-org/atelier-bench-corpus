// DO NOT FIX. Intentionally invalid: unterminated class body.

export class Broken {
    constructor(readonly id: number) {}

    label(): string {
        return `broken-${this.id}`;
    }

    describe(): string {
        return this.label();
