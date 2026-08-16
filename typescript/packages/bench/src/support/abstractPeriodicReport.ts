/** Base for reports that also run on a cadence. */

import { Cadence, type ScheduleContract } from "../contracts/scheduleContract";
import { AbstractReport } from "./abstractReport";

export abstract class AbstractPeriodicReport extends AbstractReport implements ScheduleContract {
    protected constructor(
        slug: string,
        title: string,
        readonly cadence: Cadence,
    ) {
        super(slug, title);
    }

    /** Next run instant, aligned to the cadence grid. */
    nextRunSeconds(now: number): number {
        const period = Cadence.seconds(this.cadence);

        return now - (now % period) + period;
    }
}
