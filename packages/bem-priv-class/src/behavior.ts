export interface IBemJson {
    json(): object;
}

export interface IBehavior {
    bemjson: object;
    addBehavior<T extends BehaviorBlock>(block: T): this;
}

export type BehaviorBlock = IBehavior & IBemJson;

export abstract class Behavior implements IBehavior, IBemJson {
    private behaviors: BehaviorBlock[] = [];
    protected _bemjson: object = {};

    public json() : object {
        if (this.behaviors.length) {
            this.behaviors.forEach((behavior) => {
                return behavior.json();
            });
        }

        return this.bemjson;
    }

    public set bemjson(bemjson: object) {
        this._bemjson = bemjson;
    }

    public get bemjson() {
        return this._bemjson;
    }

    addBehavior<T extends BehaviorBlock>(block: T): this {
        block.bemjson = this._bemjson;
        this.behaviors.push(block);
        return this;
    }
}
