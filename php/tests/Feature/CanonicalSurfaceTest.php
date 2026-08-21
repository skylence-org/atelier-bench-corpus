<?php

namespace Tests\Feature;

use App\Bench\Contracts\FormatterContract;
use App\Bench\Reports\ReportRegistry;
use App\Models\RepairOrder;
use App\Support\Canonical\AtelierError;
use App\Support\Canonical\CanonicalProbe;
use App\Support\Canonical\DuckFormatter;
use App\Support\Canonical\Ledger;
use App\Support\Canonical\NotFoundError;
use App\Support\Canonical\Reporting\ReportRow;
use App\Support\Canonical\Reporting\Summaries\CashSummary;
use App\Support\Canonical\Reporting\Summaries\DiscountSummary;
use App\Support\Canonical\Reporting\Summaries\LaborSummary;
use App\Support\Canonical\Reporting\Summaries\PartsSummary;
use App\Support\Canonical\Reporting\Summaries\PayrollSummary;
use App\Support\Canonical\Reporting\Summaries\RefundSummary;
use App\Support\Canonical\Reporting\Summaries\TaxSummary;
use App\Support\Canonical\Reporting\Summaries\WarrantySummary;
use App\Support\Canonical\Reporting\SummaryContract;
use App\Support\Canonical\TypeOnlyProbe;
use App\Enums\Priority;
use Database\Seeders\CanonicalSeeder;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use ReflectionClass;
use ReflectionMethod;
use Tests\TestCase;

class CanonicalSurfaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_probe_reaches_the_global_function_class_const_and_static_factory(): void
    {
        $probe = new CanonicalProbe();

        $this->assertStringStartsWith('CN-', $probe->formattedReference(7));
        $this->assertSame('-', $probe->separator());
        $this->assertSame(Priority::Rush, $probe->rushPriority());
    }

    public function test_container_resolved_contract_method_returns_the_standard_total(): void
    {
        $order = RepairOrder::factory()->create();

        $this->assertSame(
            (int) config('atelier.labor_rate_cents'),
            (new CanonicalProbe())->invoiceTotal($order),
        );
    }

    public function test_barrel_import_does_not_fan_out_to_the_barrel_file(): void
    {
        $exported = 'App\\Support\\Canonical\\Exports\\Ledger';

        $this->assertTrue(class_exists($exported));
        $this->assertSame(Ledger::class, (new ReflectionClass($exported))->getName());
        $this->assertSame(
            realpath(app_path('Support/Canonical/Ledger.php')),
            (new ReflectionMethod($exported, 'add'))->getFileName(),
        );
        $this->assertSame(1500, (new CanonicalProbe())->ledgerTotal(1500));
    }

    public function test_error_subclass_is_thrown_not_the_base(): void
    {
        $this->expectException(NotFoundError::class);

        try {
            (new CanonicalProbe())->requireReference(null);
        } catch (NotFoundError $error) {
            $this->assertInstanceOf(AtelierError::class, $error);
            $this->assertSame('repair order not found: ', $error->getMessage());

            throw $error;
        }
    }

    public function test_type_only_probe_has_no_runtime_edge(): void
    {
        $order = RepairOrder::factory()->create();

        $this->assertSame($order->reference, (new TypeOnlyProbe())->referenceOf($order));
    }

    public function test_duck_formatter_matches_the_shape_without_implementing_it(): void
    {
        $duck = new DuckFormatter();

        $this->assertSame('12', $duck->format(12));
        $this->assertNotInstanceOf(FormatterContract::class, $duck);
        $this->assertNotContains(
            FormatterContract::class,
            class_implements(DuckFormatter::class),
        );
    }

    public function test_eight_summaries_fan_into_row_from_cents(): void
    {
        $summaries = [
            new CashSummary(),
            new LaborSummary(),
            new PartsSummary(),
            new PayrollSummary(),
            new RefundSummary(),
            new TaxSummary(),
            new WarrantySummary(),
            new DiscountSummary(),
        ];

        $this->assertCount(8, $summaries);

        foreach ($summaries as $summary) {
            $this->assertInstanceOf(SummaryContract::class, $summary);
            $rows = $summary->rows();
            $this->assertCount(1, $rows);
            $this->assertInstanceOf(ReportRow::class, $rows[0]);
            $this->assertGreaterThan(0, $rows[0]->cents);
            $this->assertNotSame('', $rows[0]->label);
        }
    }

    public function test_report_registry_fans_in_all_twenty_four_reports(): void
    {
        $this->assertCount(24, ReportRegistry::REPORTS);
        $this->assertSame(24, ReportRegistry::count());
        $this->assertSame(ReportRegistry::REPORTS, ReportRegistry::all());

        foreach (ReportRegistry::all() as $report) {
            $this->assertTrue(class_exists($report));
        }
    }

    public function test_canonical_seeder_delegates_to_the_frozen_dataset_seeder(): void
    {
        $this->seed(CanonicalSeeder::class);

        $this->assertDatabaseHas('customers', ['email' => 'ada@example.test']);
    }

    public function test_dataset_seeder_runs_directly_too(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseHas('technicians', ['email' => 'grace@example.test']);
    }
}
