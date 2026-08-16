<?php

namespace App\Bench\Services;

use App\Bench\Support\AbstractService;
use App\Bench\Concerns\HasLogging;
use App\Bench\Concerns\HasValidation;
use App\Bench\Repositories\PartRepository;
use App\Bench\Repositories\InventoryRepository;

class PartUsageService extends AbstractService
{
    use HasLogging;
    use HasValidation;

    public function __construct(
        private readonly PartRepository $partRepository,
        private readonly InventoryRepository $inventoryRepository
    ) {
    }

    public function run(): array
    {
        $total = 0.0;
        $total += $this->partRepository->sum();
        $total += $this->inventoryRepository->sum();
        $this->log('PartUsageService computed ' . $total);

        return ['total' => $this->assertPositive($total), 'records' => $this->records()];
    }

    public function records(): int
    {
        $n = 0;
        $n += $this->partRepository->count();
        $n += $this->inventoryRepository->count();
        return $n;
    }
}
