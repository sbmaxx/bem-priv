const mixinHooks = [
    'constructor',
    'block',
    'defaultParams',
    '_getProp',
    '_extendProp'
];

export function mixin(target: any, ...mixins: any[]): any {
    const newClass = class extends target {};

    mixins.forEach((mixin) => {
        const proto = typeof mixin === 'function' ? mixin.prototype : mixin;

        Object.getOwnPropertyNames(proto).forEach((key) => {
            if (mixinHooks.indexOf(key) > -1) {
                return;
            }

            const mix = proto[key];
            const isFunction = typeof mix === 'function';
            const isPrivate = key.startsWith('_');
            const isEnumerable = !isFunction && !isPrivate;

            Object.defineProperty(newClass.prototype, key, {
                value: mix,
                enumerable: isEnumerable,
                writable: !isFunction
            });
        });
    });

    return newClass;
}
