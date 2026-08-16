/** Base shared by all 8 exporters. */

import type { ExporterContract } from "../contracts/exporterContract";
import type { FormatterContract } from "../contracts/formatterContract";
import type { ReportRow } from "../contracts/reportContract";

export abstract class AbstractExporter implements ExporterContract, FormatterContract {
    protected constructor(
        readonly extension: string,
        readonly mime: string,
    ) {}

    abstract export(rows: readonly ReportRow[]): string;

    filename(slug: string): string {
        return `${slug}.${this.extension}`;
    }

    formatCents(cents: number): string {
        const sign = cents < 0 ? "-" : "";
        const abs = Math.abs(cents);

        return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
    }

    formatPercent(ratio: number): string {
        return `${(ratio * 100).toFixed(1)}%`;
    }

    formatCount(count: number): string {
        return String(count);
    }
}
