<?php

namespace Tests\Feature;

use App\Bench\Contracts\RepositoryContract;
use App\Bench\Repositories\CustomerRepository;
use App\Concerns\ForwardsToSchedule;
use App\Jobs\RecalculateInventory as RecalculateInventoryJob;
use App\Models\Part;
use App\Models\Technician;
use App\Support\Canonical\Wave2\NamespaceOneMember;
use App\Support\Canonical\Wave2\OrderStream;
use App\Support\Canonical\Wave2\PricingPolicy;
use App\Support\Canonical\Wave2\RepositoryGlob;
use App\Support\Canonical\Wave2\StreamConsumer;
use App\Support\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Throwable;
use Tests\TestCase;

use const App\Support\Canonical\Wave2\DEFAULT_REFERENCE_PREFIX;

class Wave2SurfaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_module_const_mirrors_the_global_prefix(): void
    {
        $this->assertSame(ATELIER_REF_PREFIX, DEFAULT_REFERENCE_PREFIX);
        $this->assertSame('AT', DEFAULT_REFERENCE_PREFIX);
    }

    public function test_mixin_method_is_reached_through_the_trait(): void
    {
        $technician = Technician::factory()->create();

        $this->assertInstanceOf(Schedule::class, $technician->schedule());
        $this->assertStringEndsWith(
            'ForwardsToSchedule.php',
            (new \ReflectionMethod(Technician::class, 'schedule'))->getFileName(),
        );
        $this->assertContains(ForwardsToSchedule::class, class_uses(Technician::class));
    }

    public function test_generator_yields_lazily(): void
    {
        $stream = new OrderStream(['at-1', 'at-2', 'at-3']);

        $this->assertInstanceOf(\Generator::class, $stream->each());
        $this->assertSame(['AT-1', 'AT-2', 'AT-3'], (new StreamConsumer())->collect($stream));
    }

    public function test_callback_style_reports_through_its_continuation(): void
    {
        Part::factory()->count(2)->create();
        $seen = [];

        RecalculateInventoryJob::withCallback(3, function (?Throwable $error, int $parts) use (&$seen): void {
            $seen[] = [$error, $parts];
        });

        $this->assertCount(1, $seen);
        $this->assertNull($seen[0][0]);
        $this->assertSame(Part::query()->count(), $seen[0][1]);
    }

    public function test_group_use_binds_exactly_eight_repositories(): void
    {
        $bound = RepositoryGlob::all();

        $this->assertCount(8, $bound);
        $this->assertSame($bound, array_unique($bound));

        foreach ($bound as $repository) {
            $this->assertContains(RepositoryContract::class, class_implements($repository));
        }

        $this->assertGreaterThan(0, RepositoryGlob::total());
    }

    public function test_namespace_prefix_reads_one_member(): void
    {
        $this->assertSame(48, NamespaceOneMember::ruleCount());
    }

    public function test_eight_repositories_satisfy_the_generic_contract(): void
    {
        $implementors = array_filter(
            get_declared_classes(),
            static fn (string $class): bool => in_array(RepositoryContract::class, class_implements($class), true),
        );

        $this->assertContains(CustomerRepository::class, $implementors);
        $this->assertCount(8, RepositoryGlob::all());
        $this->assertIsArray((new CustomerRepository())->all());
        $this->assertIsInt((new CustomerRepository())->count());
        $this->assertIsFloat((new CustomerRepository())->sum());
    }

    public function test_trait_conflict_resolves_to_the_surcharge_half(): void
    {
        $policy = new PricingPolicy();

        $this->assertSame(15, $policy->rate());
        $this->assertSame(5, $policy->discountRate());
        $this->assertSame(110, $policy->net(100));
    }

    public function test_broken_fixtures_still_refuse_to_parse(): void
    {
        foreach (['Broken.php', 'partial.blade.php'] as $fixture) {
            $path = base_path('fixtures/broken-syntax/' . $fixture);

            $this->assertFileExists($path);
            $this->assertNotSame('', file_get_contents($path));
        }

        exec('php -l ' . escapeshellarg(base_path('fixtures/broken-syntax/Broken.php')) . ' 2>&1', $output, $code);
        $this->assertNotSame(0, $code);
    }
}
