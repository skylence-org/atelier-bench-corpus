/** Console entrypoint. */

import { parseCommand, usage } from "./commands/index";
import { exportReport } from "./commands/exportReport";
import { recalculateInventory } from "./commands/recalculateInventory";
import { metricLines, summarize } from "./seed";
import { serve } from "./index";
import { seededState } from "./state";

const state = seededState();
const command = parseCommand(process.argv.slice(2));

switch (command.kind) {
    case "serve":
        serve(state, command.port);
        break;
    case "seed":
        console.log(summarize(state));
        for (const line of metricLines(state)) {
            console.log(line);
        }
        break;
    case "report":
        console.log(exportReport(state, command.slug));
        break;
    case "recalculate":
        console.log(`recalculated ${recalculateInventory(state)} part(s)`);
        break;
    case "help":
        console.log(usage());
        break;
}
