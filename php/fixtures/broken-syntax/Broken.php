<?php

namespace Fixtures\BrokenSyntax;

/**
 * DELIBERATELY BROKEN (acuity #142 class): unclosed brace + dangling method.
 * Outside composer autoload; excluded from lint sweeps by path. An indexer
 * must degrade loudly on this file, never crash or silently skip the tree.
 */
class Broken
{
    public function unfinished(): string
    {
        return 'this class never closes
