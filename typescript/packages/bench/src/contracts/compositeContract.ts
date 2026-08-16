/** Interface with three parents: exercises multi-parent fan-out. */

import type { CacheableContract } from "./cacheableContract";
import type { ReportContract } from "./reportContract";
import type { ScheduleContract } from "./scheduleContract";

export interface CompositeContract extends ReportContract, CacheableContract, ScheduleContract {}
