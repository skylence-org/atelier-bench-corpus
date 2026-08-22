<?php

namespace App\Support\Canonical\Wave2;

/*
 * Namespace-level constant seeded from the global one in app/Support/helpers.php.
 * def-module-const asks for the DECLARATION of the right-hand side, which lives
 * in helpers.php, not for this alias. Loaded through composer autoload.files
 * because a constants-only file declares no class for the classmap to find.
 */

const DEFAULT_REFERENCE_PREFIX = \ATELIER_REF_PREFIX;
