/**
 * Re-export module.
 *
 * The whole file is one `require`: `module.exports` IS another module's
 * exports object, so a lookup on `rowFromCents` has to hop through here to
 * `./contracts/reportContract.cjs`.
 */

module.exports = require("./contracts/reportContract.cjs");
