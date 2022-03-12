import './Controls.css';
import { useState } from 'react';
import ControlRow from '../ControlRow/ControlRow';
import { Control, Controller } from '../../jenkk/controllers/controller';
import cookie from 'react-cookies';
import { ControllerBuilder } from '../../jenkk/builders/controller-builder';

type ControlsProps = {
    controller: Controller
}

function Controls(props: ControlsProps) {

    const [waitingForKey, setWaitingForKey] = useState(false);

    function changeKey(control: Control) {
        return () => {
            setWaitingForKey(true);

            const handler = (event: KeyboardEvent): void => {
                if (event.code) {
                    event.preventDefault();
                    props.controller.setControl(control, event.code);
                    const savedControls = ControllerBuilder.exportControls(props.controller.controls)
                    cookie.save('controls', savedControls, {});
                    setWaitingForKey(false);
                    window.removeEventListener('keydown', handler);
                }
            }
            window.addEventListener('keydown', handler);
        }
    }

    return <div className="controls-container">
        {waitingForKey && <div className="press-a-key">Press a key</div>}
        {(Object.keys(Control) as (keyof typeof Control)[]).map((_control, key) => {
            const control = Control[_control];
            const keyCode = props.controller.getKeyCode(control);
            return <ControlRow control={control} keyCode={keyCode} onClick={changeKey(control)} key={key} ></ControlRow>
        })}
    </div>
}

export default Controls