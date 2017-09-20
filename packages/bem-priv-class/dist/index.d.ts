import { Behavior, IBemJson, BehaviorBlock, IBehavior } from './behavior';
export declare abstract class Block extends Behavior {
    private static readonly MODS_KEY;
    private static readonly MIX_KEY;
    private static readonly ATTRS_KEY;
    private static readonly PARAMS_KEY;
    private static readonly CONTENT_KEY;
    protected params: object;
    constructor(params?: object);
    protected readonly defaultParams: object;
    readonly block: any;
    mods: object;
    mix: object[];
    attrs: object;
    js: object;
    content: object[];
    addProps(props: object): void;
    private _getProp(key);
    private _extendProp(key, value);
}
export interface IComposition extends IBemJson {
    addComposition<T extends IBemJson>(block: T): this;
}
export interface IProps {
    behaviors?: BehaviorBlock[];
    [propName: string]: any;
}
export declare abstract class ComplexBlock extends Block {
    private compositions;
    constructor(params?: object);
    json(): object;
    addComposition<T extends IBemJson>(block: T): this;
    static createBlock<T extends IComposition & IBehavior>(BlockImpl: new (args?: object) => T, props?: IProps, ...compositions: IComposition[]): T;
}
