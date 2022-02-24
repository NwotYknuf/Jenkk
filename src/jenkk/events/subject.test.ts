
import { Subject } from "./subject";

describe("Subject", () => {

    const subject = new Subject<Number>();

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

        subject.notify(5);

        expect(eventA).toBeCalledTimes(1);
        expect(eventB).toBeCalledTimes(1);

        unsubA();

        subject.notify(5);

        expect(eventA).toBeCalledTimes(1);
        expect(eventB).toBeCalledTimes(2);

    });


})