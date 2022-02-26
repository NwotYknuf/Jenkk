
interface Observer<T> {

    update(value: T): void;

}

export { type Observer }