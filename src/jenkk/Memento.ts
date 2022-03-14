import { Snapshot } from "./snapshot";

interface Memento<T extends Snapshot> {
    save(): T;
    restore(snapshot: T): void;
}

export { type Memento }