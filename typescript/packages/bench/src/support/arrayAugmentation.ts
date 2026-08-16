/** Global augmentation of a built-in: `declare global` adds a member to every Array. */

declare global {
    interface Array<T> {
        second(): T | undefined;
    }
}

Array.prototype.second = function second<T>(this: T[]): T | undefined {
    return this[1];
};

/** Call site: exercises the augmented member. */
export function secondPart(parts: string[]): string | undefined {
    return parts.second();
}

export {};
