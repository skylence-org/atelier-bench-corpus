<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_datasets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('benchmark_test_id')->constrained('benchmark_tests')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('data_size')->comment('Size in bytes or number of records');
            $table->string('complexity_level')->default('medium')->comment('low, medium, high, extreme');
            $table->json('metadata')->nullable();
            $table->string('version')->default('1.0');
            $table->timestamps();
            $table->unique(['benchmark_test_id', 'name']);
            $table->index('complexity_level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_datasets');
    }
};
