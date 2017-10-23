import { Block } from '../src/block';
import { IModifier, Modifier } from '../src/modifier';
import { IBemjson } from '../src/bem';
import { assert } from 'chai';

describe('bem-priv-class modifiers', () => {
    describe('json()', () => {
        it('should return correct bemjson', () => {
            type Params = {
                id: number;
                name: string;
            };
            type Props = {
                result: string;
            };

            class MyComp extends Block<Params, Props> {
                public json() {
                    this.mix = [{block: 'test'}, {block: 'test2'}];
                    this.js = {
                        live: false,
                        data: {
                            testData: this.params
                        }
                    };
                    this.mods = {
                        test: true
                    };

                    return super.json();
                }
            }

            const modifier: Modifier<Params, Props> = (bemjson: IBemjson<Props>): IBemjson<Props> => {
                bemjson.mods = bemjson.mods || {};
                bemjson.mods.renderTest = true;
                return bemjson;
            };

            const modifierJSON: IModifier<Params, Props> = {
                json(bemjson: IBemjson<Props>): IBemjson<Props> {
                    bemjson.mods = bemjson.mods || {};
                    bemjson.mods.renderJSONTest = true;
                    return bemjson;
                }
            };

            const modifiers = [modifier, modifierJSON];

            const myComp = new MyComp({
                id: 5,
                name: 'test'
            });

            myComp.modifiers = new Set(modifiers);

            myComp.modifiers.add((bemjson: IBemjson<Props>): IBemjson<Props> => {
                bemjson.mods = bemjson.mods || {};
                bemjson.mods.renderTestFromAdd = true;
                bemjson.props = bemjson.props || {} as Props;
                bemjson.props.result = 'test!';
                return bemjson;
            });

            assert.deepEqual(myComp.json(), {
                block: 'mycomp',
                mix: [{block: 'test'}, {block: 'test2'}],
                js: {
                    live: false,
                    data: {
                        testData: {
                            id: 5,
                            name: 'test'
                        }
                    }
                },
                mods: {
                    test: true,
                    renderTest: true,
                    renderJSONTest: true,
                    renderTestFromAdd: true
                },
                props: {
                    result: 'test!'
                }
            });
        });
    });
});
