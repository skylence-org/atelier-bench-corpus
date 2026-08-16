<?php

namespace App\Bench\Support;

use App\Bench\Contracts\NotifierContract;

abstract class AbstractNotifier extends AbstractComponent implements NotifierContract
{
    public function name(): string
    {
        return 'notifier';
    }
}
