<?php

namespace App\Bench\Contracts;

interface FormatterContract
{
    public function format(mixed $value): string;
}
