import React, { useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import AlertDialog from '../Dialog';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [authNum, setAuthNum] = useState(0);
    const [userId, setUserID] = useState(0);
    const [userToken, setUserToken] = useState(0);
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleChange = setter => e => {
        setter(e.target.value);
    }

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const requestBody = {
                query: `
                    query {
                        login(email: "${email}", password: "${password}") {
                            _id
                            token
                            email
                            authNumber
                        }
                    }
                `
            };

            const { data } = await axios.post('http://localhost:5000/graphql', requestBody);

            if (data.errors) {
                setError(data.errors[0].message);
                setLoading(false);
            }
            else {
                setError(null);
                setLoading(false);
                const { _id, token, authNumber } = await data.data.login;

                setUserID(_id);
                setUserToken(token);
                setAuthNum(authNumber);
                setOpen(true);
                
            }
        }
        catch (e) {
            setError(e);
            setLoading(false);
        }
    }

    return (
        <>
            <h1>Login</h1>
            <div className="auth-form">
                <form onSubmit={submit}>
                    <input className="form-input" type="email" placeholder="Email" value={email} onChange={handleChange(setEmail)} />
                    <input className="form-input" type="password" placeholder="Password" onChange={handleChange(setPassword)} />

                    <div><span style={{ color: "red" }}>{error || ""}</span></div>

                    <input className="form-submit" type="submit" value={loading ? "Verifying..." : "Login"} />
                </form>
            </div>
            <AlertDialog history={props.history} userEmail={email} userID={userId} userToken={userToken} authNumber = {authNum} open={open} handleClose={handleClose} />
        </>
    )
}

export default withRouter(Login);