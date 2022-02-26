import { Observer } from "./observer"

class State<T> {

    private observers: Observer<T>[] = [];

    public constructor(private _value: T, private _hasChanged: boolean) { }

    public subscribe(observer: Observer<T>): () => void {
        this.observers.push(observer);
        return () => { this.observers.splice(this.observers.indexOf(observer), 1) };
    }

    public notify(): void {
        if (this._hasChanged) {
            this.observers.forEach((observer) => observer.update(this._value));
            this._hasChanged = false;
        }
    }

    public setValue(value: T) {
        this._value = value;
        this._hasChanged = true;
    }

    public changed() {
        this._hasChanged = true;
    }

    public get hasChanged(): boolean {
        return this._hasChanged;
    }

}

export { State }