# Fixtures

`broken-syntax/` holds files that MUST NOT parse. They exist to measure how
indexers and language servers behave on malformed input (loud degradation,
no crash, no silent tree-skip). They are outside composer autoload and are
excluded from the `php -l` sweep in `bench/verify_tasks.php`.

Do not "fix" these files.
