import assert from "node:assert/strict";
import { describe, it } from "node:test";

import request from "supertest";

import { createApp, seededRushState, seededState } from "@atelier/app";

describe("http surface", () => {
    it("resolves the report endpoint by reference", async () => {
        const response = await request(createApp(seededState())).get("/report/AT-2026-000001");

        assert.equal(response.status, 200);
        assert.equal(response.body.reference, "AT-2026-000001");
        assert.equal(response.body.device, "Framework 13 (SER-0001)");
        assert.equal(response.body.status, "Completed since intake");
        assert.equal(response.body.total, "349.00 EUR");
        assert.equal(response.body.calculator, "standard");
    });

    it("changes the rendered total when the binding changes", async () => {
        const response = await request(createApp(seededRushState())).get("/report/AT-2026-000002");

        assert.equal(response.status, 200);
        assert.equal(response.body.calculator, "rush");
        assert.equal(response.body.total, "292.81 EUR");
    });

    it("404s an unknown reference", async () => {
        const response = await request(createApp(seededState())).get("/report/AT-2026-999999");

        assert.equal(response.status, 404);
        assert.match(response.body.error, /999999/);
    });

    it("lists every seeded order", async () => {
        const response = await request(createApp(seededState())).get("/api/orders");

        assert.equal(response.status, 200);
        assert.equal(response.body.length, 4);
        assert.equal(response.body[0].status, "completed");
        assert.equal(response.body[1].priority, "Rush");
    });

    it("reaches the report registry over http", async () => {
        const response = await request(createApp(seededState())).get("/api/reports/gross-profit");

        assert.equal(response.status, 200);
        assert.equal(response.body[2].label, "gross profit");
        assert.equal(response.body[2].cents, 12025);
    });

    it("422s an unknown report slug", async () => {
        const response = await request(createApp(seededState())).get("/api/reports/no-such-report");

        assert.equal(response.status, 422);
        assert.equal(response.body.field, "slug");
    });

    it("rejects an empty note body", async () => {
        const response = await request(createApp(seededState()))
            .post("/api/orders/1/notes")
            .send({ body: "   " });

        assert.equal(response.status, 422);
    });

    it("creates a note with a default author", async () => {
        const response = await request(createApp(seededState()))
            .post("/api/orders/2/notes")
            .send({ body: "battery ordered" });

        assert.equal(response.status, 201);
        assert.equal(response.body.author, "counter");
        assert.equal(response.body.orderId, 2);
    });

    it("answers the health probe", async () => {
        const response = await request(createApp(seededState())).get("/health");

        assert.equal(response.status, 200);
        assert.equal(response.text, "ok");
    });
});
