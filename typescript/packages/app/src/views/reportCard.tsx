/** TSX surface: a function component rendered through the `h` factory. */

import { type Html, h } from "./h";

export interface ReportCardProps {
    readonly reference: string;
    readonly total: string;
    readonly status: string;
}

/** One order as an HTML card; `<ReportCard reference=... />` calls this. */
export function ReportCard(props: ReportCardProps): Html {
    return (
        <article class="report-card" data-reference={props.reference}>
            <h2>{props.reference}</h2>
            <p class="status">{props.status}</p>
            <p class="total">{props.total}</p>
        </article>
    );
}
