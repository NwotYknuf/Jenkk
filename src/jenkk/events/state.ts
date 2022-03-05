
type Observer<T> = (value: T) => void;

class Observable<T> {

    private observers: Observer<T>[] = [];

    public constructor(private _value: T, private _hasChanged: boolean = false) { }

    public watch(observer: Observer<T>): () => void {
        this.observers.push(observer);
        return () => { this.observers.splice(this.observers.indexOf(observer), 1) };
    }

    public notifyChange(): void {
        if (this._hasChanged) {
            this.observers.forEach((observer) => observer(this._value));
            this._hasChanged = false;
        }
    }

    public setValue(value: T) {
        this._value = value;
        this._hasChanged = true;
    }

    public getValue(): T {
        return this._value;
    }

    public changed() {
        this._hasChanged = true;
    }

    public get hasChanged(): boolean {
        return this._hasChanged;
    }

}

export { Observable, type Observer }