<?php

namespace App\Bench\Contracts;

interface NotifierContract
{
    public function notify(string $message): void;
}
