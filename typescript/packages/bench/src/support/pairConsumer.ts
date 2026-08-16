/** Imports only Left from the sibling pair; Right never enters this module's import graph. */

import { Left } from "@atelier/core";

export function describeLeft(pair: Left): string {
    return pair.value;
}
