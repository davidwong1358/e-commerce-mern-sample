import React from "react";

import { Button } from "react-bootstrap";
import { Eye, EyeSlash } from 'react-bootstrap-icons';

const PasswordVisible = (props) => {
    return (
        <Button
            id={props.id}
            className='border-0 bg-transparent toggle-password'
            onClick={() => props.onToggle(props.name)} >
            {!props.showPassword && <Eye color='black' size={24} />}
            {props.showPassword && <EyeSlash color='black' size={24} />}
        </Button>
    )
}

export default PasswordVisible;