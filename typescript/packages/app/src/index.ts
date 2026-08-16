/**
 * Application surface for the typescript lane.
 *
 * The router below is the corpus's live call path: it reaches the domain core
 * through a container binding and the breadth subsystem through the report
 * registry, so one request-level test exercises all three packages.
 */

import express, { type Express } from "express";

import { listOrders, showRegisteredReport, storeNote } from "./http/api";
import { errorHandler } from "./http/errors";
import { showReport } from "./http/report";
import { seededState, type AppState } from "./state";

export { seededRushState, seededState, type AppState } from "./state";

/** Build the whole app. Tests call this directly; `serve` wraps it. */
export function createApp(state: AppState = seededState()): Express {
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

/** Bind and serve until the process is stopped. */
export function serve(state: AppState, port: number): void {
    createApp(state).listen(port, () => {
        console.log(`atelier listening on ${port}`);
    });
}
