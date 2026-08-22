<?php

namespace App\Support\Canonical\Wave2;

use App\Bench\Rules;

/**
 * The import binds a NAMESPACE, not a class: App\Bench\Rules holds 49 classes
 * and only RuleRegistry is read through the prefix below.
 */
final class NamespaceOneMember
{
    public static function ruleCount(): int
    {
        return count(Rules\RuleRegistry::RULES);
    }
}
