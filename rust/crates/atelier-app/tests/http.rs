//! Request-level tests over the real router.

use atelier_app::router;
use atelier_app::state::AppState;
use axum::body::Body;
use axum::http::{Request, StatusCode};
use tower::ServiceExt;

async fn get(state: AppState, uri: &str) -> (StatusCode, serde_json::Value) {
    let response = router(state)
        .oneshot(
            Request::builder()
                .uri(uri)
                .body(Body::empty())
                .expect("request builds"),
        )
        .await
        .expect("router responds");

    let status = response.status();
    let bytes = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .expect("body reads");
    let json = serde_json::from_slice(&bytes).unwrap_or(serde_json::Value::Null);

    (status, json)
}

#[tokio::test]
async fn report_endpoint_resolves_by_reference() {
    let (status, body) = get(AppState::seeded(), "/report/AT-2026-000001").await;

    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["reference"], "AT-2026-000001");
    assert_eq!(body["device"], "Framework 13 (SER-0001)");
    assert_eq!(body["status"], "Completed since intake");
    assert_eq!(body["total"], "349.00 EUR");
    assert_eq!(body["calculator"], "standard");
}

#[tokio::test]
async fn rush_binding_changes_the_rendered_total() {
    let (status, body) = get(AppState::seeded_rush(), "/report/AT-2026-000002").await;

    assert_eq!(status, StatusCode::OK);
    assert_eq!(body["calculator"], "rush");
    assert_eq!(body["total"], "292.81 EUR");
}

#[tokio::test]
async fn unknown_reference_is_a_404() {
    let (status, body) = get(AppState::seeded(), "/report/AT-2026-999999").await;

    assert_eq!(status, StatusCode::NOT_FOUND);
    assert!(
        body["error"]
            .as_str()
            .unwrap_or_default()
            .contains("999999")
    );
}

#[tokio::test]
async fn order_list_carries_every_seeded_order() {
    let (status, body) = get(AppState::seeded(), "/api/orders").await;

    assert_eq!(status, StatusCode::OK);
    assert_eq!(body.as_array().map(Vec::len), Some(4));
    assert_eq!(body[0]["status"], "completed");
    assert_eq!(body[1]["priority"], "Rush");
}

#[tokio::test]
async fn report_registry_is_reachable_over_http() {
    let (status, body) = get(AppState::seeded(), "/api/reports/gross-profit").await;

    assert_eq!(status, StatusCode::OK);
    assert_eq!(body[2]["label"], "gross profit");
    assert_eq!(body[2]["cents"], 12_025);
}

#[tokio::test]
async fn unknown_report_slug_is_a_422() {
    let (status, body) = get(AppState::seeded(), "/api/reports/no-such-report").await;

    assert_eq!(status, StatusCode::UNPROCESSABLE_ENTITY);
    assert_eq!(body["field"], "slug");
}

#[tokio::test]
async fn empty_note_body_is_rejected() {
    let response = router(AppState::seeded())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/orders/1/notes")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"body":"   "}"#))
                .expect("request builds"),
        )
        .await
        .expect("router responds");

    assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);
}

#[tokio::test]
async fn note_is_created_with_a_default_author() {
    let response = router(AppState::seeded())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/orders/2/notes")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"body":"battery ordered"}"#))
                .expect("request builds"),
        )
        .await
        .expect("router responds");

    assert_eq!(response.status(), StatusCode::CREATED);

    let bytes = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .expect("body reads");
    let body: serde_json::Value = serde_json::from_slice(&bytes).expect("json");

    assert_eq!(body["author"], "counter");
    assert_eq!(body["order_id"], 2);
}

#[tokio::test]
async fn health_probe_answers() {
    let response = router(AppState::seeded())
        .oneshot(
            Request::builder()
                .uri("/health")
                .body(Body::empty())
                .expect("request builds"),
        )
        .await
        .expect("router responds");

    assert_eq!(response.status(), StatusCode::OK);
}
