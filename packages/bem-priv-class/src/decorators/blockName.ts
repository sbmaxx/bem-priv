/* tslint:disable */
export function blockName(name: string): Function {
    return (target: FunctionConstructor): Function => {
        return class extends target {
            public get block() {
                return name;
            }
        };
    };
}
/* tslint:enable */
