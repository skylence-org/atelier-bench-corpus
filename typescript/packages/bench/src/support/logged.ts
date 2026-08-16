/** Standard (TC39) decorator: TS 5 native shape, no `experimentalDecorators`. */

function logged<This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
    return function (this: This, ...args: Args): Return {
        return target.call(this, ...args);
    };
}

export class LoggedRuleRunner {
    @logged
    run(count: number): number {
        return count + 1;
    }
}
