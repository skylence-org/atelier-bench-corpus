<?php

namespace App\Bench\Reports;

use App\Bench\Support\AbstractPeriodicReport;
use App\Bench\Contracts\CacheableContract;
use App\Bench\Contracts\AuditableContract;
use App\Bench\Concerns\HasTimestamps;
use App\Bench\Concerns\HasCache;
use App\Bench\Concerns\HasAudit;
use App\Bench\Services\PaymentLatencyService;
use App\Bench\Services\ThroughputService;

class ChurnRiskReport extends AbstractPeriodicReport implements CacheableContract, AuditableContract
{
    use HasTimestamps;
    use HasCache;
    use HasAudit;

    public function __construct(
        private readonly PaymentLatencyService $paymentLatencyService,
        private readonly ThroughputService $throughputService,
    ) {
    }

    public function name(): string
    {
        return 'churnriskreport';
    }

    public function generate(): array
    {
        $this->record('generate:ChurnRiskReport');
        $primary = $this->paymentLatencyService->run();
        $secondary = $this->throughputService->run();

        return $this->remember($this->cacheKey(), fn () => [
            'primary' => $primary,
            'secondary' => $secondary,
            'at' => $this->touchedAt(),
        ]);
    }

    public function cacheKey(): string
    {
        return 'report:churnriskreport';
    }

    public function ttl(): int
    {
        return 3600;
    }

    public function auditTrail(): array
    {
        return $this->trail;
    }
}
