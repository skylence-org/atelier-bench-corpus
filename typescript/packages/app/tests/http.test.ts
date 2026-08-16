import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp, seededRushState, seededState } from "@atelier/app";

describe("http surface", () => {
    it("resolves the report endpoint by reference", async () => {
        const response = await request(createApp(seededState())).get("/report/AT-2026-000001");

        expect(response.status).toBe(200);
        expect(response.body.reference).toBe("AT-2026-000001");
        expect(response.body.device).toBe("Framework 13 (SER-0001)");
        expect(response.body.status).toBe("Completed since intake");
        expect(response.body.total).toBe("349.00 EUR");
        expect(response.body.calculator).toBe("standard");
    });

    it("changes the rendered total when the binding changes", async () => {
        const response = await request(createApp(seededRushState())).get("/report/AT-2026-000002");

        expect(response.status).toBe(200);
        expect(response.body.calculator).toBe("rush");
        expect(response.body.total).toBe("292.81 EUR");
    });

    it("404s an unknown reference", async () => {
        const response = await request(createApp(seededState())).get("/report/AT-2026-999999");

        expect(response.status).toBe(404);
        expect(response.body.error).toContain("999999");
    });

    it("lists every seeded order", async () => {
        const response = await request(createApp(seededState())).get("/api/orders");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(4);
        expect(response.body[0].status).toBe("completed");
        expect(response.body[1].priority).toBe("Rush");
    });

    it("reaches the report registry over http", async () => {
        const response = await request(createApp(seededState())).get("/api/reports/gross-profit");

        expect(response.status).toBe(200);
        expect(response.body[2].label).toBe("gross profit");
        expect(response.body[2].cents).toBe(12025);
    });

    it("422s an unknown report slug", async () => {
        const response = await request(createApp(seededState())).get("/api/reports/no-such-report");

        expect(response.status).toBe(422);
        expect(response.body.field).toBe("slug");
    });

    it("rejects an empty note body", async () => {
        const response = await request(createApp(seededState()))
            .post("/api/orders/1/notes")
            .send({ body: "   " });

        expect(response.status).toBe(422);
    });

    it("creates a note with a default author", async () => {
        const response = await request(createApp(seededState()))
            .post("/api/orders/2/notes")
            .send({ body: "battery ordered" });

        expect(response.status).toBe(201);
        expect(response.body.author).toBe("counter");
        expect(response.body.orderId).toBe(2);
    });

    it("answers the health probe", async () => {
        const response = await request(createApp(seededState())).get("/health");

        expect(response.status).toBe(200);
        expect(response.text).toBe("ok");
    });
});
