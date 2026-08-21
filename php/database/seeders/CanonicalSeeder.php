<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Delegating seeder: the in-code fan-in site for DatabaseSeeder::run(), which
 * artisan otherwise reaches only through a runtime string.
 */
class CanonicalSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(DatabaseSeeder::class);
    }
}
