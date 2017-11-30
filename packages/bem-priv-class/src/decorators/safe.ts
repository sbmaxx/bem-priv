const jsonHook = 'json';

function wrapToTryCatch(method: () => void, callback: ErrorCallback, defaultValue = {}) {
    return function() {
        try {
            return method.apply(this, arguments);
        } catch (e) {
            callback(e);
        }

        return defaultValue;
    };
}

export type ErrorCallback = (e: Error) => void;

export function safe(callback: ErrorCallback, defaultValue?: any): MethodDecorator {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const method = descriptor.value;

        descriptor.value = function() {
            try {
                return method.apply(this, arguments);
            } catch (e) {
                callback(e);
            }

            if (defaultValue) {
                return defaultValue;
            }

            if (propertyKey === jsonHook) {
                return '';
            }
        };
    };
}

/* tslint:disable */
export function safeBlock(callback: ErrorCallback): Function {
    return (target: FunctionConstructor): Function => {
        return class extends target {
            constructor() {
                super();

                for (let propName in this) {
                    const method = this[propName];

                    if (typeof method === 'function') {
                        this[propName] = wrapToTryCatch(method, callback);
                    }
                }
            }
        }
    };
}


export function safeJson(callback: ErrorCallback): Function {
    return (target: FunctionConstructor): Function => {
        return class extends target {
            constructor() {
                super();

                const method = this[jsonHook];
                this[jsonHook] = wrapToTryCatch(method, callback, '');
            }
        }
    };
}
/* tslint:enable */
