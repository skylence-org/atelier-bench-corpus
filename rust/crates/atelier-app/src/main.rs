//! Console entrypoint.
//!
//! `serve` starts the HTTP surface; the other subcommands mirror the php
//! lane's artisan commands.

use atelier_app::commands::Command;
use atelier_app::state::AppState;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let args: Vec<String> = std::env::args().skip(1).collect();
    let command = Command::parse(&args);
    let state = AppState::seeded();

    match command {
        Command::Serve { port } => atelier_app::serve(state, port).await,
        Command::Seed => {
            let summary = atelier_app::seed::summarize(&state);
            println!("{summary}");

            Ok(())
        }
        Command::Report { slug } => {
            let body = atelier_app::commands::export_report::run(&state, &slug)?;
            println!("{body}");

            Ok(())
        }
        Command::Recalculate => {
            let touched = atelier_app::commands::recalculate_inventory::run(&state);
            println!("recalculated {touched} part(s)");

            Ok(())
        }
        Command::Help => {
            println!("{}", Command::usage());

            Ok(())
        }
    }
}
