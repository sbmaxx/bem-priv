export function BlockName(name: string): Function {
    return (target: FunctionConstructor): Function => {
        return class extends target {
            constructor() {
                super();
            }

            public get block() {
                return name;
            }
        };
    };
}
