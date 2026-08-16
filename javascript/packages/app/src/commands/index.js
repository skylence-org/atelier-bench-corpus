/** Console command parsing and dispatch. */

/**
 * Every subcommand the binary accepts.
 *
 * @typedef {{ kind: "serve", port: number }
 *   | { kind: "seed" }
 *   | { kind: "report", slug: string }
 *   | { kind: "recalculate" }
 *   | { kind: "help" }} Command
 */

/** Default port when `serve` is given no argument. */
export const DEFAULT_PORT = 8080;

/**
 * Parse argv (already stripped of the program name).
 *
 * @param {readonly string[]} args
 * @returns {Command}
 */
export function parseCommand(args) {
    switch (args[0]) {
        case "serve":
            return { kind: "serve", port: Number(args[1] ?? DEFAULT_PORT) || DEFAULT_PORT };
        case "seed":
            return { kind: "seed" };
        case "report":
            return { kind: "report", slug: args[1] ?? "gross-profit" };
        case "recalculate":
            return { kind: "recalculate" };
        default:
            return { kind: "help" };
    }
}

/**
 * Usage text printed by `help` and by an unknown subcommand.
 *
 * @returns {string}
 */
export function usage() {
    return "usage: atelier <serve [port]|seed|report [slug]|recalculate>";
}
