/** Console entrypoint. */

import process from "node:process";

import { parseCommand, usage } from "./commands/index.js";
import { exportReport } from "./commands/exportReport.js";
import { recalculateInventory } from "./commands/recalculateInventory.js";
import { metricLines, ruleLine, summarize } from "./seed.js";
import { serve } from "./index.js";
import { seededState } from "./state.js";

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
        console.log(ruleLine(state));
        break;
    case "report":
        console.log(exportReport(state, command.slug));
        break;
    case "recalculate":
        console.log(await recalculateInventory(state));
        break;
    default:
        console.log(usage());
}
