<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('measurements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_result_id')->constrained('test_results')->cascadeOnDelete();
            $table->string('metric_name');
            $table->float('actual_value');
            $table->string('unit');
            $table->boolean('passed')->default(false);
            $table->float('variance_percent')->nullable()->comment('% difference from expected');
            $table->timestamps();
            $table->index(['test_result_id', 'metric_name']);
            $table->index('passed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('measurements');
    }
};
