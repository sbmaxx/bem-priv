import { IBemjson } from './bem';

export type ModifierFunction<Params, Props> = (
    bemjson?: IBemjson<Props>,
    params?: Params
) => IBemjson<Props>;

export interface IModifier<Params, Props> {
    json: ModifierFunction<Params, Props>;
}

export type Modifier<Params, Props> = IModifier<Params, Props> | ModifierFunction<Params, Props>;
