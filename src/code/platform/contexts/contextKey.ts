import { Context, ContextKeyService, ContextKey } from './contextKeyService';

export abstract class ContextKeyExpr {
    public static has(key: string) {
        return new ContextKeyHasExpr(key);
    }

    public static not(expr: ContextKeyExpr) {
        return new ContextKeyNotExpr(expr);
    }

    public static and(...expr: ContextKeyExpr[]) {
        return new ContextKeyAndExpr(...expr);
    }

    public static or(...expr: ContextKeyExpr[]) {
        return new ContextKeyOrExpr(...expr);
    }

    public static equal(key: string, value: any) {
        return new ContextKeyEqualExpr(key, value);
    }

    public abstract evaluate(context: Context): boolean;
}

export class ContextKeyHasExpr implements ContextKeyExpr {
    constructor(
        protected key: string,
    ) {
    }

    public evaluate(context: Context): boolean {
        return !!context.getValue(this.key);
    }
}

export class ContextKeyNotExpr implements ContextKeyExpr {
    constructor(
        private expr: ContextKeyExpr,
    ) {

    }

    public evaluate(context: Context): boolean {
        return !this.expr.evaluate(context);
    }
}

export class ContextKeyAndExpr implements ContextKeyExpr {
    private expressions: ContextKeyExpr[];

    constructor(
        ...expr: ContextKeyExpr[]
    ) {
        this.expressions = expr;
    }

    public evaluate(context: Context): boolean {
        for (const expr of this.expressions) {
            if (!expr.evaluate(context)) {
                return false;
            }
        }

        return true;
    }
}


export class ContextKeyOrExpr implements ContextKeyExpr {
    private expressions: ContextKeyExpr[];

    constructor(
        ...expr: ContextKeyExpr[]
    ) {
        this.expressions = expr;
    }

    public evaluate(context: Context): boolean {
        for (const expr of this.expressions) {
            if (expr.evaluate(context)) {
                return true;
            }
        }

        return false;
    }
}

export class ContextKeyEqualExpr implements ContextKeyExpr {
    constructor(
        private key: string,
        private value: any,
    ) {
        
    }

    public evaluate(context: Context): boolean {
        return context.getValue(this.key) === this.value;
    }
}

export class RawContextKey<T> extends ContextKeyHasExpr {
    private defaultValue: T;
    constructor(key: string, defaultValue: T) {
        super(key);
        this.defaultValue = defaultValue;
    }

    public bindTo(service: ContextKeyService): ContextKey<T> {
        return service.createKey(this.key, this.defaultValue);
    }

    public not(): ContextKeyNotExpr {
        return ContextKeyExpr.not(this);
    }
}

