# fixtures

Negative cases for parsers and indexers. **Do not fix anything in here.**

| Path | Why it exists |
| --- | --- |
| `broken-syntax/unclosed_function.js` | Unterminated function body and a truncated object literal: the parser must report an error, not a partial tree |
| `broken-syntax/bad_destructure.cjs` | Unbalanced destructuring patterns and an unclosed `require(` call |

`jsconfig.json` excludes `fixtures/`, and nothing under `packages/` imports these files, so
`npm test` never loads them.

`node bench/verify-tasks/verify.mjs --lint` asserts the opposite of the usual check: every file
here must still **fail** `node --check`.
