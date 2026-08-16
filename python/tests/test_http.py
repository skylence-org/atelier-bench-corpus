import unittest

from atelier_app import create_app, seeded_rush_state, seeded_state


class HttpTest(unittest.TestCase):
    def test_report_endpoint_resolves_by_reference(self) -> None:
        client = create_app(seeded_state()).test_client()
        response = client.get("/report/AT-2026-000001")
        self.assertEqual(response.status_code, 200)
        body = response.get_json()
        self.assertEqual(body["reference"], "AT-2026-000001")
        self.assertEqual(body["device"], "Framework 13 (SER-0001)")
        self.assertEqual(body["status"], "Completed since intake")
        self.assertEqual(body["total"], "349.00 EUR")
        self.assertEqual(body["calculator"], "standard")

    def test_rush_binding_changes_the_total(self) -> None:
        response = create_app(seeded_rush_state()).test_client().get("/report/AT-2026-000002")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["calculator"], "rush")
        self.assertEqual(response.get_json()["total"], "292.81 EUR")

    def test_unknown_reference_is_404(self) -> None:
        response = create_app(seeded_state()).test_client().get("/report/AT-2026-999999")
        self.assertEqual(response.status_code, 404)
        self.assertIn("999999", response.get_json()["error"])

    def test_health_and_orders(self) -> None:
        client = create_app(seeded_state()).test_client()
        self.assertEqual(client.get("/health").data, b"ok")
        orders = client.get("/api/orders").get_json()
        self.assertEqual(len(orders), 4)
        self.assertEqual(orders[1]["priority"], "Rush")

    def test_notes_validate_and_create(self) -> None:
        client = create_app(seeded_state()).test_client()
        self.assertEqual(client.post("/api/orders/1/notes", json={"body": "  "}).status_code, 422)
        self.assertEqual(client.post("/api/orders/99/notes", json={"body": "x"}).status_code, 404)
        created = client.post("/api/orders/1/notes", json={"body": "screen replaced"})
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.get_json()["author"], "counter")

    def test_registered_reports(self) -> None:
        client = create_app(seeded_state()).test_client()
        rows = client.get("/api/reports/gross-profit").get_json()
        self.assertEqual(rows[2]["cents"], 12025)
        self.assertEqual(client.get("/api/reports/nope").status_code, 422)


if __name__ == "__main__":
    unittest.main()
