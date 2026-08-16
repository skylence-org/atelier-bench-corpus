# fixtures

Negative cases for parsers and indexers. **Do not fix anything in here.**

| Path | Why it exists |
| --- | --- |
| `broken-syntax/unclosed_class.ts` | Unterminated class body: the parser must report an error, not a partial tree |
| `broken-syntax/bad_generics.ts` | Unbalanced generic brackets and a truncated `extends` constraint |

`tsconfig.json` excludes `fixtures/`, so `npm run typecheck` never sees these files.
`node bench/verify-tasks/verify.mjs --lint` asserts the opposite of the usual check: every file
here must still **fail** to compile.
