import cookie from 'react-cookies';
import { Control } from './jenkk/controllers/controller';
import { Options } from './jenkk/builders/controller-builder';

function importControls(): Map<string, Control> | undefined {
    const controlsCookie = cookie.load('controls', true);
    if (controlsCookie) {
        return new Map<string, Control>(JSON.parse(controlsCookie));
    }
    return undefined;
}

function exportControls(controls: Map<string, Control>): void {
    cookie.save("controls", JSON.stringify(Array.from(controls.entries())), {});
}

function exportOptions(options: Options) {
    cookie.save("options", JSON.stringify(options), {});
}

function importOptions(): Options | undefined {
    const optionsCookie = cookie.load('options', true);
    if (optionsCookie) {
        return JSON.parse(optionsCookie) as Options;
    }
    return undefined;
}

export { importControls, exportControls, importOptions, exportOptions }

