import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AuthCode from 'react-auth-code-input';
import { useDispatch } from 'redux-react-hook';
import * as actions from '../../constants/action_types';
import * as routes from '../../constants/routes';
import Button from '@mui/material/Button';
import './dialog.css';

export default function AlertDialog(props) {
    const dispatch = useDispatch();
    const [result, setResult] = React.useState(0);
    const handleOnChange = (res) => {
        setResult(res);
    }
    const checkAuth = () => {
        if(result.toString() == props.authNumber) {
            dispatch({
                type: actions.SET_AUTH_USER,
                authUser: {
                    _id : props.userID,
                    email : props.userEmail
                }
            })
            localStorage.setItem('token', props.userToken);
            props.history.push(routes.HOME);
        }
    }
    return (
        <div>
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <AuthCode allowedCharacters='numeric' onChange={handleOnChange} className="auth-code" />
            <Button onClick={checkAuth}>Go</Button>
        </Dialog>
        </div>
    );
}