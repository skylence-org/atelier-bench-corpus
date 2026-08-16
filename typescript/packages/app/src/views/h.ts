/**
 * JSX factory for the TSX surface: no framework, no virtual DOM. `jsxFactory`
 * in tsconfig.base.json points every JSX element at this function, which
 * renders straight to an `Html` string wrapper.
 */

/** Rendered markup. Text children are escaped; `Html` children are spliced in as-is. */
export class Html {
    constructor(readonly html: string) {}

    toString(): string {
        return this.html;
    }
}

export type Child = Html | string | number | boolean | null | undefined | Child[];

export type Props = Record<string, unknown> | null;

/** Function components take props and return rendered markup. */
export type Component<P extends object> = (props: P) => Html;

function escapeHtml(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderChildren(children: Child[]): string {
    return children
        .flatMap((child) => (Array.isArray(child) ? [renderChildren(child)] : [child]))
        .filter((child) => child !== null && child !== undefined && child !== false && child !== true)
        .map((child) => (child instanceof Html ? child.html : escapeHtml(String(child))))
        .join("");
}

/** `<tag prop="v">children</tag>` or `<Component prop={v} />` become this call. */
export function h(tag: string | Component<never>, props: Props, ...children: Child[]): Html {
    if (typeof tag === "function") {
        return (tag as Component<object>)({ ...(props ?? {}), children });
    }

    const attributes = Object.entries(props ?? {})
        .filter(([, value]) => value !== undefined && value !== false && value !== null)
        .map(([name, value]) => (value === true ? ` ${name}` : ` ${name}="${escapeHtml(String(value))}"`))
        .join("");

    return new Html(`<${tag}${attributes}>${renderChildren(children)}</${tag}>`);
}

/** `<>...</>` fragments render their children only. */
export function Fragment(props: { children?: Child[] }): Html {
    return new Html(renderChildren(props.children ?? []));
}
