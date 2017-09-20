export interface IBemJson {
    json(): object;
}
export interface IBehavior {
    bemjson: object;
    addBehavior<T extends BehaviorBlock>(block: T): this;
}
export declare type BehaviorBlock = IBehavior & IBemJson;
export declare abstract class Behavior implements IBehavior, IBemJson {
    private behaviors;
    protected _bemjson: object;
    json(): object;
    bemjson: object;
    addBehavior<T extends BehaviorBlock>(block: T): this;
}
