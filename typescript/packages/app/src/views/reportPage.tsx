/** TSX surface: intrinsic elements, a fragment and a component element. */

import { Fragment, type Html, h } from "./h";
import { ReportCard } from "./reportCard";
import type { ReportView } from "../http/report";

/** Renders the JSON view as HTML: `<ReportCard />` resolves to the function in reportCard.tsx. */
export function renderReportPage(view: ReportView): Html {
    return (
        <>
            <h1>Repair report</h1>
            <ReportCard reference={view.reference} total={view.total} status={view.status} />
        </>
    );
}
