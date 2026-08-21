<?php

namespace App\Support\Canonical;

use RuntimeException;

/**
 * Base of the canonical error hierarchy.
 *
 * def-error-subclass asks for the THROWN subclass, never this base.
 */
class AtelierError extends RuntimeException
{
}
