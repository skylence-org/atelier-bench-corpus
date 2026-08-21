<?php

/*
 * Barrel: re-export only, zero declarations.
 *
 * Loaded eagerly through composer's autoload.files because an alias stub holds
 * no class declaration for the optimized classmap to find. Every name below is
 * declared elsewhere; this file must never be the answer to "where is it defined".
 */

class_alias(\App\Support\Canonical\Ledger::class, 'App\Support\Canonical\Exports\Ledger');
