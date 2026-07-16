<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware coverage + HTTP-context helpers: session(), request() data,
 * now(), tap(). Applied to the report route only.
 */
class RecordReportVisit
{
    public function next(Request $request): never
    {
        abort(410, 'Renamed to handle(); kept as a decoy definition target.');
    }

    public function handle(Request $request, Closure $next): Response
    {
        session()->put('atelier.last_report_visit', [
            'url' => $request->fullUrl(),
            'at' => now()->toIso8601String(),
        ]);

        return tap($next($request), function (Response $response): void {
            $response->headers->set('X-Atelier-Bench', 'corpus');
        });
    }
}
