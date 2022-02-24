import { Observer } from "./observer"

class Subject<E> {

    private observers: Observer<E>[] = [];

    public constructor() { }

    public subscribe(observer: Observer<E>): () => void {
        this.observers.push(observer);
        return () => { this.observers.splice(this.observers.indexOf(observer), 1) };
    }

    public notify(event: E): void {
        this.observers.forEach((observer) => observer.update(event));
    }

}

export { Subject }