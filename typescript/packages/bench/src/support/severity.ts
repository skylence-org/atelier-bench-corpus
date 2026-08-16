/** `const enum`: inlined at every use site; the declaration still exists for lookups. */

export const enum Severity {
    Low = "low",
    Medium = "medium",
    High = "high",
}

export function severityLabel(severity: Severity): string {
    return severity === Severity.High ? "high" : severity === Severity.Medium ? "medium" : "low";
}

export const defaultSeverity = Severity.Medium;
