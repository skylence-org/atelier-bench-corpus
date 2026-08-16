/** Class expression assigned to a const: the identifier lives on the value, not the class keyword position. */

export const Adhoc = class Adhoc {
    constructor(readonly label: string) {}

    describe(): string {
        return `adhoc:${this.label}`;
    }
};

/** Construction site: the value, not a `class Adhoc` declaration, is what gets called. */
export const namedAdhoc = new Adhoc("demo");
