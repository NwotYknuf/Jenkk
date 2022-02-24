
interface Observer<E> {

    update(event: E): void;

}

export { type Observer }