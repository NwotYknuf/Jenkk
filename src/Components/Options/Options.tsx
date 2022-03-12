import "./Options.css"
import { Controller } from "../../jenkk/controllers/controller";
import NumberField from "../NumberField/NumberField";

type OptionsProp = {
    controller: Controller;
}

function Options(props: OptionsProp) {

    const changeDAS = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (value || value === 0) {
            props.controller.DAS = value;
        }
    }

    const changeARR = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (value || value === 0) {
            props.controller.ARR = value;
        }
    }

    const changeSDR = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (value || value === 0) {
            props.controller.SDR = value;
        }
    }

    return <div className="options-container">
        <NumberField key="DAS" onChange={changeDAS} text={"DAS (ms)"} defaultValue={props.controller.DAS}></NumberField>
        <NumberField key="ARR" onChange={changeARR} text={"ARR (ms)"} defaultValue={props.controller.ARR}></NumberField>
        <NumberField key="SDR" onChange={changeSDR} text={"SDR (ms)"} defaultValue={props.controller.SDR}></NumberField>
    </div>
}

export default Options;