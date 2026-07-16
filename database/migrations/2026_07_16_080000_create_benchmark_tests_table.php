<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('benchmark_tests', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('category');
            $table->boolean('is_active')->default(true);
            $table->string('version')->default('1.0');
            $table->string('test_type')->comment('unit, integration, performance, accuracy');
            $table->timestamps();
            $table->index('category');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('benchmark_tests');
    }
};
