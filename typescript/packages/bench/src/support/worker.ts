/** Declaration merging on a class: the interface half adds a member the class body never declares. */

export abstract class Worker {
    abstract run(): void;
}

export interface Worker {
    readonly concurrency: number;
}
