<?php

namespace App\Bench\Repositories;

use App\Bench\Contracts\RepositoryContract;
use App\Bench\Support\AbstractComponent;
use App\Bench\Concerns\HasCache;

class CustomerRepository extends AbstractComponent implements RepositoryContract
{
    use HasCache;

    public function name(): string
    {
        return 'customerrepository';
    }

    public function all(): array
    {
        return $this->remember('all', fn () => range(1, 100));
    }

    public function count(): int
    {
        return count($this->all());
    }

    public function sum(): float
    {
        return (float) array_sum($this->all());
    }
}
