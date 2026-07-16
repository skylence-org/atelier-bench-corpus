<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route-model binding by the custom `reference` key (binding-resolution edge)
// + route-level middleware (session/request helper context).
Route::get('/report/{repairOrder:reference}', [ReportController::class, 'show'])
    ->middleware(App\Http\Middleware\RecordReportVisit::class)
    ->name('report.show');
