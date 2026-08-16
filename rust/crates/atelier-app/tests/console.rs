//! Command parsing, the inventory job and the CSV export path.

use atelier_app::commands::Command;
use atelier_app::state::AppState;

fn args(raw: &[&str]) -> Vec<String> {
    raw.iter().map(|value| value.to_string()).collect()
}

#[test]
fn parses_every_subcommand() {
    assert_eq!(
        Command::parse(&args(&["serve"])),
        Command::Serve { port: 8_080 }
    );
    assert_eq!(
        Command::parse(&args(&["serve", "9000"])),
        Command::Serve { port: 9_000 }
    );
    assert_eq!(Command::parse(&args(&["seed"])), Command::Seed);
    assert_eq!(
        Command::parse(&args(&["report", "part-usage"])),
        Command::Report {
            slug: "part-usage".to_string()
        }
    );
    assert_eq!(Command::parse(&args(&["nonsense"])), Command::Help);
}

#[test]
fn inventory_job_announces_depleted_parts() {
    let state = AppState::seeded();

    assert_eq!(atelier_app::commands::recalculate_inventory::run(&state), 1);
}

#[test]
fn export_renders_csv_for_a_registered_report() {
    let state = AppState::seeded();
    let csv = atelier_app::commands::export_report::run(&state, "gross-profit").expect("renders");

    assert!(csv.contains("gross profit,120.25"));
    assert!(atelier_app::commands::export_report::run(&state, "nope").is_err());
}

#[test]
fn seed_summary_reports_the_frozen_numbers() {
    let state = AppState::seeded();

    assert_eq!(
        atelier_app::seed::summarize(&state),
        "seeded: 3 customer(s), 4 order(s), 4 part(s), revenue 58325c"
    );
    assert_eq!(atelier_app::seed::metric_lines(&state).len(), 16);
}
