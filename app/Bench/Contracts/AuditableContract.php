<?php

namespace App\Bench\Contracts;

interface AuditableContract
{
    public function auditTrail(): array;
}
