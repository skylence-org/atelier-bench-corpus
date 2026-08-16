//! Build script: writes a module into OUT_DIR that `src/support/generated_units.rs`
//! pulls in with `include!`. The function it defines has no declaration anywhere
//! in the source tree; only the build script and the include line exist.

use std::env;
use std::fs;
use std::path::Path;

fn main() {
    let out_dir = env::var("OUT_DIR").expect("cargo sets OUT_DIR for build scripts");
    let dest = Path::new(&out_dir).join("generated_units.rs");
    let source = concat!(
        "/// Generated at build time by build.rs; not present in src/.\n",
        "pub fn generated_units() -> [&'static str; 4] {\n",
        "    [\"piece\", \"hour\", \"gram\", \"metre\"]\n",
        "}\n",
        "\n",
        "/// Generated constant: how many units the atelier prices by.\n",
        "pub const GENERATED_UNIT_COUNT: usize = 4;\n",
    );
    fs::write(&dest, source).expect("write generated_units.rs");
    println!("cargo:rerun-if-changed=build.rs");
}
