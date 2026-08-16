<?php

use App\Http\Controllers\ReportController;
use App\Http\Controllers\SocialAuthController;
use Illuminate\Support\Facades\Route;
use Livewire\Volt\Volt;

Route::get('/', function () {
    return view('welcome');
});

// Route-model binding by the custom `reference` key (binding-resolution edge)
// + route-level middleware (session/request helper context).
Route::get('/report/{repairOrder:reference}', [ReportController::class, 'show'])
    ->middleware(App\Http\Middleware\RecordReportVisit::class)
    ->name('report.show');

// Full-page Livewire component route (class-component routing coverage).
Route::get('/board', App\Livewire\StatusBoard::class)->name('board');

// Socialite OAuth pair: config-driven provider resolution; the redirect leg
// is network-free (builds the provider URL from config/services).
Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback']);

// Volt functional component route (Volt::route registration coverage).
Volt::route('/rush-counter', 'rush-counter')->name('rush.counter');
