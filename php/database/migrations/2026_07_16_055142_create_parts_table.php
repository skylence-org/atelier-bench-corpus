<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parts', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('name');
            $table->integer('unit_price_cents')->default(0);
            $table->integer('stock')->default(0);
            $table->timestamps();
        });

        Schema::create('part_repair_order', function (Blueprint $table) {
            $table->id();
            $table->foreignId('part_id')->constrained()->cascadeOnDelete();
            $table->foreignId('repair_order_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->integer('unit_price_cents');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('part_repair_order');
        Schema::dropIfExists('parts');
    }
};
