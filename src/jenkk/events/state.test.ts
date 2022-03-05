
import { Observable } from "./state";

describe("State", () => {

    const subject = new Observable<Number>(0);

    it("Can have subscribers", () => {

        const eventA = jest.fn();
        const eventB = jest.fn();

        const unsubA = subject.watch(eventA);
        subject.watch(eventB);

        expect(eventA).toBeCalledTimes(0);
        expect(eventB).toBeCalledTimes(0);

        subject.setValue(5);
        subject.notifyChange();

        expect(eventA).toBeCalledTimes(1);
        expect(eventB).toBeCalledTimes(1);

        unsubA();

        subject.setValue(5);
        subject.notifyChange();

        expect(eventA).toBeCalledTimes(1);
        expect(eventB).toBeCalledTimes(2);

    });
});