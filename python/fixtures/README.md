# Broken-syntax fixtures (python lane)

**DO NOT FIX.** These files are intentionally invalid Python: parser/indexer
negative cases. They live outside every package and `verify_tasks.py --lint`
requires `python -m py_compile` to REJECT each of them.

| File | Defect |
| --- | --- |
| `broken-syntax/unclosed_class.py` | class body never closes: dangling `def` with no body |
| `broken-syntax/bad_indent.py` | inconsistent indentation inside a function |
