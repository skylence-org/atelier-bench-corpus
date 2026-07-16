<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('benchmark_test_id')->constrained('benchmark_tests')->cascadeOnDelete();
            $table->foreignId('test_dataset_id')->constrained('test_datasets')->cascadeOnDelete();
            $table->string('status')->default('pending')->comment('pending, running, passed, failed, error');
            $table->float('execution_time_ms')->nullable();
            $table->float('memory_usage_mb')->nullable();
            $table->float('cpu_usage_percent')->nullable();
            $table->float('accuracy_score')->nullable()->comment('0-100');
            $table->text('notes')->nullable();
            $table->json('run_metadata')->nullable();
            $table->timestamp('executed_at')->nullable();
            $table->timestamps();
            $table->index(['benchmark_test_id', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_results');
    }
};
