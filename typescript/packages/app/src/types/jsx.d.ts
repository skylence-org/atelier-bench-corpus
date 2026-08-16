/**
 * Ambient declaration file: the global JSX namespace the `h` factory needs.
 * Nothing imports this file; tsconfig includes it. `JSX.Element` is the `Html`
 * wrapper `h` returns, and every intrinsic tag accepts any attribute bag.
 */

declare namespace JSX {
    type Element = import("../views/h").Html;

    interface ElementChildrenAttribute {
        children: unknown;
    }

    interface IntrinsicElements {
        [tag: string]: Record<string, unknown>;
    }
}
