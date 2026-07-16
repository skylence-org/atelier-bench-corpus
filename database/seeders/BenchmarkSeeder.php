<?php

namespace Database\Seeders;

use App\Models\BenchmarkMetric;
use App\Models\BenchmarkTest;
use App\Models\Measurement;
use App\Models\TestDataset;
use App\Models\TestResult;
use Illuminate\Database\Seeder;

class BenchmarkSeeder extends Seeder
{
    public function run(): void
    {
        $tests = BenchmarkTest::factory(5)->create();

        foreach ($tests as $test) {
            $datasets = TestDataset::factory(3)->for($test, 'benchmarkTest')->create();

            foreach ($datasets as $dataset) {
                BenchmarkMetric::factory(4)
                    ->for($dataset, 'testDataset')
                    ->create();

                $results = TestResult::factory(6)
                    ->for($test, 'benchmarkTest')
                    ->for($dataset, 'testDataset')
                    ->create();

                foreach ($results as $result) {
                    Measurement::factory(4)
                        ->for($result, 'testResult')
                        ->create();
                }
            }
        }
    }
}
