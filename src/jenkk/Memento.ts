interface Memento<T> {
    save(): T;
    restore(snapshot: T): void;
}

export { type Memento }