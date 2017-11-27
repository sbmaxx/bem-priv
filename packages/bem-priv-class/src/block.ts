import { IAttrs, IBemjson, IMix, IMods } from './bem';
import { Modifier, IModifier } from './modifier';

export type HashMap = Record<string, any>;

export abstract class Block<Params extends HashMap, Props extends HashMap> implements IModifier<Params, Props> {
    private static readonly MODS_KEY: string = 'mods';
    private static readonly MIX_KEY: string = 'mix';
    private static readonly ATTRS_KEY: string = 'attrs';
    private static readonly PARAMS_KEY: string = 'js';
    private static readonly CONTENT_KEY: string = 'content';
    private static readonly PROPS_KEY: string = 'props';

    protected params: Params;

    private _bemjson: IBemjson<Props>;

    private _modifiers: Set<Modifier<Params, Props>>;

    constructor(params?: Params) {
        this.params = Object.assign(this.defaultParams, params);

        this._modifiers = new Set<Modifier<Params, Props>>();

        this._bemjson = {
            block: this.block,
            props: {} as Partial<Props>
        };
    }

    public json(): IBemjson<Props> {
        this._modifiers.forEach((render: Modifier<Params, Props>) => {
            if (render instanceof Function) {
                this.bemjson = render(this.bemjson, this.params);
            } else {
                this.bemjson = render.json(this.bemjson, this.params);
            }
        });

        return this.bemjson;
    }

    public get modifiers(): Set<Modifier<Params, Props>> {
        return this._modifiers;
    }

    public set modifiers(modifiers: Set<Modifier<Params, Props>>) {
        this._modifiers = modifiers;
    }

    protected get defaultParams(): Params {
        return {} as Params;
    }

    protected get block(): string {
        return (this as any).constructor.name.toLowerCase();
    }

    protected get mods(): IMods {
        return this._getProp(Block.MODS_KEY);
    }

    protected set mods(mods: IMods) {
        this._bemjson[Block.MODS_KEY] = mods;
    }

    protected get mix(): IMix[] {
        return this._getProp(Block.MIX_KEY);
    }

    protected set mix(mix: IMix[]) {
        this._bemjson[Block.MIX_KEY] = mix;
    }

    protected get attrs(): IAttrs {
        return this._getProp(Block.ATTRS_KEY);
    }

    protected set attrs(attrs: IAttrs) {
        this._bemjson[Block.ATTRS_KEY] = attrs;
    }

    protected get js(): Record<string, any> {
        return this._getProp(Block.PARAMS_KEY);
    }

    protected set js(params: Record<string, any>) {
        this._bemjson[Block.PARAMS_KEY] = params;
    }

    protected get content(): Array<IBemjson<any> | string | number> {
        return this._getProp(Block.CONTENT_KEY);
    }

    protected set content(content: Array<IBemjson<any> | string | number>) {
        this._bemjson[Block.CONTENT_KEY] = content;
    }

    protected get props(): Partial<Props> {
        return this._getProp(Block.PROPS_KEY);
    }

    protected set props(props: Partial<Props>) {
        this._bemjson[Block.PROPS_KEY] = props;
    }

    protected get bemjson(): IBemjson<Props> {
        return this._bemjson;
    }

    protected set bemjson(bemjson: IBemjson<Props>) {
        this._bemjson = bemjson;
    }

    private _getProp<T>(key: string): T {
        if (!this._bemjson[key]) {
            this._bemjson[key] = key === Block.MIX_KEY || key === Block.CONTENT_KEY ? [] : {};
        }

        return this._bemjson[key];
    }
}
