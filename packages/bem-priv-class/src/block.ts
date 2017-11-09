export interface IMods extends Record<string, string | boolean | number> {}

export interface IAttrs extends Record<string, string | boolean | number> {}

export interface IMix {
    block?: string;
    mods?: IMods;
    elem?: string;
    elemMods?: IMods;
    js?: Record<string, any>;
}

export interface IBemjson<T> extends IMix {
    block: string;
    attrs?: IAttrs;
    mix?: IMix[];
    content?: Array<IBemjson<T> | string | number>;
    bem?: boolean;
    cls?: string;
    tag?: string;
    props: T;
}

export abstract class Block<T = any> {
    private static readonly MODS_KEY: string = 'mods';
    private static readonly MIX_KEY: string = 'mix';
    private static readonly ATTRS_KEY: string = 'attrs';
    private static readonly PARAMS_KEY: string = 'js';
    private static readonly CONTENT_KEY: string = 'content';

    protected params: Record<string, any>;

    private _bemjson: IBemjson<T>;

    constructor(params?: Record<string, any>) {
        this.params = Object.assign(this.defaultParams, params);

        this._bemjson = {
            block: this.block,
            props: {} as T
        };
    }

    protected get defaultParams(): Record<string, any> {
        return {};
    }

    public get block(): string {
        return (this as any).constructor.name.toLowerCase();
    }

    public json(): IBemjson<T> {
        return this.bemjson;
    }

    public get mods(): IMods {
        return this._getProp(Block.MODS_KEY) as IMods;
    }

    public set mods(mods: IMods) {
        this._bemjson[Block.MODS_KEY] = mods;
    }

    public get mix(): IMix[] {
        return this._getProp(Block.MIX_KEY) as IMix[];
    }

    public set mix(mix: IMix[]) {
        this._bemjson[Block.MIX_KEY] = mix;
    }

    public get attrs(): IAttrs {
        return this._getProp(Block.ATTRS_KEY) as IAttrs;
    }

    public set attrs(attrs: IAttrs) {
        this._bemjson[Block.ATTRS_KEY] = attrs;
    }

    public get js(): Record<string, any> {
        return this._getProp(Block.PARAMS_KEY);
    }

    public set js(params: Record<string, any>) {
        this._bemjson[Block.PARAMS_KEY] = params;
    }

    public get content(): Array<IBemjson<T> | string | number> {
        return this._getProp(Block.CONTENT_KEY) as Array<IBemjson<T> | string | number>;
    }

    public set content(content: Array<IBemjson<T> | string | number>) {
        this._bemjson[Block.CONTENT_KEY] = content;
    }

    public get props(): T {
        return this._bemjson.props;
    }

    public addProps(props: Record<keyof T, any>): void {
        Object.assign(this._bemjson.props, props);
    }

    protected get bemjson(): IBemjson<T> {
        return this._bemjson;
    }

    private _getProp(key: string): object | object[] {
        if (!this._bemjson[key]) {
            this._bemjson[key] = key === Block.MIX_KEY || key === Block.CONTENT_KEY ? [] : {};
        }

        return this._bemjson[key];
    }
}
