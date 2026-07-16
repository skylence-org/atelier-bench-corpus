<?php

use App\Http\Controllers\BenchmarkApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/benchmarks')->group(function () {
    Route::get('/', [BenchmarkApiController::class, 'listTests']);
    Route::get('/{test}', [BenchmarkApiController::class, 'getTest']);
    Route::get('/{test}/analyze', [BenchmarkApiController::class, 'analyzeTest']);
    
    Route::post('/run', [BenchmarkApiController::class, 'runTest']);
    Route::post('/compare', [BenchmarkApiController::class, 'compareResults']);
    
    Route::get('/results', [BenchmarkApiController::class, 'getResults']);
});

Route::prefix('v1/datasets')->group(function () {
    Route::get('/{dataset}', [BenchmarkApiController::class, 'getDataset']);
    Route::get('/{dataset}/analyze', [BenchmarkApiController::class, 'analyzeDataset']);
});
