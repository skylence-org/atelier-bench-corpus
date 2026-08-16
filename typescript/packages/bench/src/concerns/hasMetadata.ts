/** Ordered key/value metadata. */

export interface HasMetadata {
    metadata(): ReadonlyMap<string, string>;
    meta(key: string): string | undefined;
    metaKeys(): readonly string[];
}

/** Insertion-ordered bag, so metadata rendering is deterministic. */
export class MetadataBag implements HasMetadata {
    private readonly entries = new Map<string, string>();

    set(key: string, value: string): this {
        this.entries.set(key, value);

        return this;
    }

    metadata(): ReadonlyMap<string, string> {
        return this.entries;
    }

    meta(key: string): string | undefined {
        return this.entries.get(key);
    }

    metaKeys(): readonly string[] {
        return [...this.entries.keys()];
    }
}
