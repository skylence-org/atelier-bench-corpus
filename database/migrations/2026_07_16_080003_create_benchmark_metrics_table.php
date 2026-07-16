<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('benchmark_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_dataset_id')->constrained('test_datasets')->cascadeOnDelete();
            $table->string('metric_name');
            $table->string('metric_type')->comment('time, memory, cpu, accuracy, throughput, etc');
            $table->float('expected_value');
            $table->string('unit')->comment('ms, mb, percent, score, ops/sec, etc');
            $table->text('description')->nullable();
            $table->float('threshold_warning')->nullable()->comment('Value above which is warning');
            $table->float('threshold_critical')->nullable()->comment('Value above which is critical');
            $table->timestamps();
            $table->unique(['test_dataset_id', 'metric_name']);
            $table->index('metric_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('benchmark_metrics');
    }
};
