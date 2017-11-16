/* tslint:disable */
export type ErrorCallback = (e: Error) => void;

export function safe<T>(callback: ErrorCallback): Function {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const method = descriptor.value;

        descriptor.value = function(): T {
            try {
                return method.apply(this, arguments);
            } catch(e) {
                callback(e);
            } finally {
                return {} as T;
            }
        };
    };
}
/* tslint:enable */
