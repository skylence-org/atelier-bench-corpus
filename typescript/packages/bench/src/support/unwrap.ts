/** Conditional type: unwrap a Promise, or pass the type through unchanged. */

export type Unwrap<T> = T extends Promise<infer U> ? U : T;

/** A real value typed through Unwrap, not through a Promise. */
export const unwrappedOrderCount: Unwrap<Promise<number>> = 4;
