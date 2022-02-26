
import { State } from "./state";

describe("State", () => {

    const subject = new State<Number>(0, false);

    it("Can have subscribers", () => {

        const eventA = jest.fn();
        const eventB = jest.fn();

        const subA = {
            update: (event: Number) => {
                eventA();
            }
        }

        const subB = {
            update: (event: Number) => {
                eventB();
            }
        }

        const unsubA = subject.subscribe(subA);
        subject.subscribe(subB);

        expect(eventA).toBeCalledTimes(0);
        expect(eventB).toBeCalledTimes(0);

        subject.setValue(5);
        subject.notify();

        expect(eventA).toBeCalledTimes(1);
        expect(eventB).toBeCalledTimes(1);

        unsubA();

        subject.setValue(5);
        subject.notify();

        expect(eventA).toBeCalledTimes(1);
        expect(eventB).toBeCalledTimes(2);

    });


})