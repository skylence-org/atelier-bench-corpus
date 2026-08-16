/** Sibling exports: most consumers need only one side. */

export class Left {
    constructor(readonly value: string) {}
}

export class Right {
    constructor(readonly value: string) {}
}
