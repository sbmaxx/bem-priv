export interface IMods extends Record<string, string | boolean | number> {}

export interface IAttrs extends Record<string, string | boolean | number> {}

export interface IMix {
    block?: string;
    mods?: IMods;
    elem?: string;
    elemMods?: IMods;
    js?: Record<string, any>;
}

export interface IBemjson<Props> extends IMix {
    attrs?: IAttrs;
    mix?: IMix[];
    content?: Array<IBemjson<Record<string, any>> | string | number>;
    bem?: boolean;
    cls?: string;
    tag?: string;
    props?: Partial<Props>;
}
