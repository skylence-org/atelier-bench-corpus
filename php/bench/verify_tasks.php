#!/usr/bin/env php
<?php

/**
 * Self-check for bench/tasks.json needle uniqueness.
 *
 * Usage:
 *   php bench/verify_tasks.php                # resolve every file+needle pair
 *   php bench/verify_tasks.php --lint          # php -l over app/ bench/ config/ database/ routes/
 *   php bench/verify_tasks.php --root <dir>    # verify another lane-shaped directory
 *
 * Zero composer deps. Exit 0 only when every check passes. Mirrors
 * rust/bench/verify-tasks/src/main.rs, typescript/bench/verify-tasks/verify.mjs
 * and javascript/bench/verify-tasks/verify.mjs line for line so every lane is
 * scored the same way.
 */

declare(strict_types=1);

$argvFlags = array_slice($argv, 1);
$root = resolveRoot($argvFlags);

if (in_array('--lint', $argvFlags, true)) {
    exit(runLint($root));
}

$manifestPath = $root . '/bench/tasks.json';
if (! is_file($manifestPath)) {
    fwrite(STDERR, "FAIL: missing {$manifestPath}\n");
    exit(1);
}

$raw = file_get_contents($manifestPath);
if ($raw === false) {
    fwrite(STDERR, "FAIL: cannot read {$manifestPath}\n");
    exit(1);
}

$data = json_decode($raw, true);
if (! is_array($data) || ! isset($data['tasks']) || ! is_array($data['tasks'])) {
    fwrite(STDERR, "FAIL: tasks.json missing tasks array\n");
    exit(1);
}

$anyFail = false;

foreach ($data['tasks'] as $task) {
    if (! is_array($task) || ! isset($task['id'])) {
        fwrite(STDERR, "FAIL: task missing id\n");
        $anyFail = true;
        continue;
    }

    $id = (string) $task['id'];
    $pairs = collectNeedlePairs($task);
    $fromLine = null;
    $expectResolved = 0;
    $taskFailed = false;
    $failMessages = [];

    foreach ($pairs as $pair) {
        $file = $pair['file'];
        $needle = $pair['needle'];
        $role = $pair['role'];
        $abs = $root . '/' . $file;

        if (! is_file($abs)) {
            $failMessages[] = "{$id}: FAIL {$file} needle " . summarizeNeedle($needle) . " (file missing)";
            $taskFailed = true;
            continue;
        }

        $content = file_get_contents($abs);
        if ($content === false) {
            $failMessages[] = "{$id}: FAIL {$file} needle " . summarizeNeedle($needle) . " (unreadable)";
            $taskFailed = true;
            continue;
        }

        $lines = preg_split("/\r\n|\n|\r/", $content);
        if ($lines === false) {
            $failMessages[] = "{$id}: FAIL {$file} needle " . summarizeNeedle($needle) . " (split failed)";
            $taskFailed = true;
            continue;
        }

        $hits = [];
        foreach ($lines as $i => $line) {
            if (str_contains($line, $needle)) {
                $hits[] = $i + 1; // 1-based
            }
        }

        $n = count($hits);
        if ($n !== 1) {
            $failMessages[] = "{$id}: FAIL {$file} needle " . summarizeNeedle($needle) . " (found {$n} times)";
            $taskFailed = true;
            continue;
        }

        if ($role === 'from') {
            $fromLine = $hits[0];
        } else {
            $expectResolved++;
        }
    }

    if ($taskFailed) {
        $anyFail = true;
        foreach ($failMessages as $msg) {
            echo $msg . "\n";
        }
        continue;
    }

    $fromFile = is_array($task['from'] ?? null) ? (string) ($task['from']['file'] ?? '?') : '?';
    $fromDisplay = $fromLine !== null ? "{$fromFile}:{$fromLine}" : "{$fromFile}:?";
    echo "{$id}: OK (from {$fromDisplay} -> {$expectResolved} expect needles resolved)\n";
}

exit($anyFail ? 1 : 0);

/**
 * Collect every {file, needle} pair from a task.
 * Roles: 'from' | 'expect'
 *
 * @return list<array{file: string, needle: string, role: string}>
 */
function collectNeedlePairs(array $task): array
{
    $pairs = [];

    if (isset($task['from']) && is_array($task['from'])) {
        $from = $task['from'];
        if (isset($from['file'], $from['needle']) && is_string($from['file']) && is_string($from['needle'])) {
            $pairs[] = ['file' => $from['file'], 'needle' => $from['needle'], 'role' => 'from'];
        }
    }

    if (! isset($task['expect']) || ! is_array($task['expect'])) {
        return $pairs;
    }

    $expect = $task['expect'];

    // Direct file+needle on expect
    if (isset($expect['file'], $expect['needle']) && is_string($expect['file']) && is_string($expect['needle'])) {
        $pairs[] = ['file' => $expect['file'], 'needle' => $expect['needle'], 'role' => 'expect'];
    }

    // Nested arrays of file+needle objects
    foreach (['known_sites', 'implementations', 'known_callers', 'outgoing_includes'] as $key) {
        if (! isset($expect[$key]) || ! is_array($expect[$key])) {
            continue;
        }
        foreach ($expect[$key] as $item) {
            if (! is_array($item)) {
                continue;
            }
            if (isset($item['file'], $item['needle']) && is_string($item['file']) && is_string($item['needle'])) {
                $pairs[] = ['file' => $item['file'], 'needle' => $item['needle'], 'role' => 'expect'];
            }
        }
    }

    // Single nested candidate
    if (isset($expect['candidate']) && is_array($expect['candidate'])) {
        $c = $expect['candidate'];
        if (isset($c['file'], $c['needle']) && is_string($c['file']) && is_string($c['needle'])) {
            $pairs[] = ['file' => $c['file'], 'needle' => $c['needle'], 'role' => 'expect'];
        }
    }

    // Non-needle expect keys (contains, behavior, must_include, min_*, kind, resolution) ignored by design.

    return $pairs;
}

function summarizeNeedle(string $needle): string
{
    if (strlen($needle) <= 80) {
        return $needle;
    }

    return substr($needle, 0, 77) . '...';
}

/** Lane root = the parent of bench/, unless --root <dir> is given. */
function resolveRoot(array $flags): string
{
    $index = array_search('--root', $flags, true);
    if ($index !== false && isset($flags[$index + 1])) {
        $resolved = realpath($flags[$index + 1]);
        return $resolved !== false ? $resolved : $flags[$index + 1];
    }

    return dirname(__DIR__);
}

function runLint(string $root): int
{
    $dirs = ['app', 'bench', 'config', 'database', 'routes'];
    $failed = 0;
    $checked = 0;

    foreach ($dirs as $dir) {
        $base = $root . '/' . $dir;
        if (! is_dir($base)) {
            continue;
        }
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS)
        );
        foreach ($iterator as $fileInfo) {
            /** @var SplFileInfo $fileInfo */
            if (! $fileInfo->isFile()) {
                continue;
            }
            if (strtolower($fileInfo->getExtension()) !== 'php') {
                continue;
            }
            $path = $fileInfo->getPathname();
            // Skip fixtures/ entirely (also if somehow nested)
            if (str_contains($path, DIRECTORY_SEPARATOR . 'fixtures' . DIRECTORY_SEPARATOR)
                || str_contains($path, '/fixtures/')) {
                continue;
            }
            $checked++;
            $cmd = 'php -l ' . escapeshellarg($path) . ' 2>&1';
            $output = [];
            $code = 0;
            exec($cmd, $output, $code);
            $text = implode("\n", $output);
            if ($code !== 0) {
                echo "LINT FAIL: {$path}\n{$text}\n";
                $failed++;
            } else {
                // Quiet success; still print one summary line at end
            }
        }
    }

    if ($failed > 0) {
        echo "lint: {$failed} failed of {$checked} php files\n";
        return 1;
    }

    echo "lint: OK ({$checked} php files under app/ bench/ config/ database/ routes/)\n";
    return 0;
}
