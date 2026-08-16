/**
 * Application surface for the javascript lane.
 *
 * The router below is the corpus's live call path: it reaches the domain core
 * through a container binding and the breadth subsystem through the report
 * registry, so one request-level test exercises all three packages.
 */

import express from "express";

import { listOrders, showRegisteredReport, storeNote } from "./http/api.js";
import { errorHandler } from "./http/errors.js";
import { showReport } from "./http/report.js";
import { seededState } from "./state.js";

export { seededRushState, seededState } from "./state.js";

/**
 * Build the whole app. Tests call this directly; `serve` wraps it.
 *
 * @param {import("./state.js").AppState} [state]
 * @returns {import("express").Express}
 */
export function createApp(state = seededState()) {
    const app = express();

    app.use(express.json());

    app.get("/health", (_req, res) => {
        res.type("text/plain").send("ok");
    });
    app.get("/report/:reference", showReport(state));
    app.get("/api/orders", listOrders(state));
    app.post("/api/orders/:id/notes", storeNote(state));
    app.get("/api/reports/:slug", showRegisteredReport(state));

    app.use(errorHandler);

    return app;
}

/**
 * Bind and serve until the process is stopped.
 *
 * @param {import("./state.js").AppState} state
 * @param {number} port
 * @returns {void}
 */
export function serve(state, port) {
    createApp(state).listen(port, () => {
        console.log(`atelier listening on ${port}`);
    });
}
