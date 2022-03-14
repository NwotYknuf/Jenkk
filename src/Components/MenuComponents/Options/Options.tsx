import "./Options.css"
import { Controller } from "../../../jenkk/controllers/controller";
import NumberField from "../NumberField/NumberField";
import { exportOptions } from "../../../cookies";
import { Options as JenkkOptions } from "../../../jenkk/builders/controller-builder";
import { useState } from "react";

type OptionsProp = {
    controller: Controller;
}

function Options(props: OptionsProp) {

    const [errorDAS, setErrorDAS] = useState(false);
    const [errorARR, setErrorARR] = useState(false);
    const [errorSDR, setErrorSDR] = useState(false);

    const errorSetters: Map<keyof (JenkkOptions), React.Dispatch<React.SetStateAction<boolean>>> =
        new Map<keyof (JenkkOptions), React.Dispatch<React.SetStateAction<boolean>>>([
            ["DAS", setErrorDAS],
            ["ARR", setErrorARR],
            ["SDR", setErrorSDR],
        ]);

    function saveOptions() {
        const options: JenkkOptions = {
            DAS: props.controller.DAS,
            ARR: props.controller.ARR,
            SDR: props.controller.SDR
        }
        exportOptions(options);
    }

    const changeHandling = (key: keyof (JenkkOptions)) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(event.target.value);
            const setError = errorSetters.get(key);
            if (!isNaN(value) && value >= 0 && value <= 1000) {
                props.controller[key] = value;
                saveOptions();
                if (setError) {
                    setError(false);
                }
            }
            else {
                if (setError) {
                    setError(true);
                }
            }
        }
    }

    return <div className="options-container">
        <NumberField key="DAS" onChange={changeHandling("DAS")} text={"DAS (ms)"} defaultValue={props.controller.DAS}
            errorText="Value must be between 0 and 1000" error={errorDAS}></NumberField>
        <NumberField key="ARR" onChange={changeHandling("ARR")} text={"ARR (ms)"} defaultValue={props.controller.ARR}
            errorText="Value must be between 0 and 1000" error={errorARR}></NumberField>
        <NumberField key="SDR" onChange={changeHandling("SDR")} text={"SDR (ms)"} defaultValue={props.controller.SDR}
            errorText="Value must be between 0 and 1000" error={errorSDR}></NumberField>
    </div>
}

export default Options;