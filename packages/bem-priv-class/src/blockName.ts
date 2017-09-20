/* tslint:disable */
export function BlockName(name: string): Function {
    return (target: FunctionConstructor): Function => {
        return class extends target {
            public get block() {
                return name;
            }
        };
    };
}
/* tslint:enable */
