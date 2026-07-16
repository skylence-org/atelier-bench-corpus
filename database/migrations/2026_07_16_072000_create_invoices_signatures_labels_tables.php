<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Completes the Eloquent relationship matrix: invoices (HasOne +
// HasOneThrough target), signatures (MorphOne), labels + labelables
// (first-party MorphToMany/MorphedByMany, alongside vendor spatie tags).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_order_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('number')->unique();
            $table->integer('total_cents')->default(0);
            $table->timestamp('issued_at');
            $table->timestamps();
        });

        Schema::create('signatures', function (Blueprint $table) {
            $table->id();
            $table->morphs('signable');
            $table->string('signed_by');
            $table->timestamp('signed_at');
            $table->timestamps();
        });

        Schema::create('labels', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('color')->default('gray');
            $table->timestamps();
        });

        Schema::create('labelables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('label_id')->constrained()->cascadeOnDelete();
            $table->morphs('labelable');
            $table->unique(['label_id', 'labelable_id', 'labelable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('labelables');
        Schema::dropIfExists('labels');
        Schema::dropIfExists('signatures');
        Schema::dropIfExists('invoices');
    }
};
