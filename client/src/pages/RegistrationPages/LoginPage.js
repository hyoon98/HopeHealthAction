import React, { useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Button, Form, FormGroup, FormFeedback, Label, Input } from 'reactstrap';

import "../../css/Login.css";

function Login() {
    const WRONGPASSWORD = '0'
    const UNREGISTERED = '2'
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameErr, setUsernameErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);

    useEffect(() => {
        document.title = "Login"
    }, [])

    function initialErrState() {
        setUsernameErr(false)
        setPasswordErr(false)
    }

    function authPasses() {
        let isPass = true
        if (!username.length > 0) {
            setUsernameErr(true)
            isPass = false
        }
        if (!password.length > 0) {
            setPasswordErr(true)
            isPass = false
        }
        return isPass
    }

    function createCookie(user) {
        const maxAge = 60 * 60; // 60 mins
        document.cookie = "cookiename=cookievalue;max-age=" + (maxAge);
        axios.get('users/session', { params: { username: user['Username'] } })
            .then(res => {
                document.cookie = `Username=${username};max-age=` + (maxAge);
                document.cookie = `Role=${res.data[0].Role};max-age=` + (maxAge);
                document.cookie = `WorkerId=${res.data[0].WorkerId};max-age=` + (maxAge);
                if (res.data[0].Role === 'Worker') {
                    window.location.replace('/');
                }
                else {
                    window.location.replace('/admin/dashboard');
                }

            })
            .catch(err => console.log(err))
    }

    function accountValidation(res, user) {
        if (res.data == WRONGPASSWORD) {
            alert("Wrong Password");
            window.location.replace("/login");
        }
        else if (res.data == UNREGISTERED) {
            alert("User is not registered");
            window.location.replace("/login");
        } else {
            createCookie(user)
        }
    }

    function login(user) {
        axios.post('/users/login', user)
            .then(res => {
                accountValidation(res, user)
                return;
            })
            .catch(err => {
                console.log(err);
            })
    }

    function handleSubmit(event) {
        event.preventDefault();
        initialErrState();

        if (authPasses()) {
            let credentials = {}
            credentials['Username'] = username
            credentials['Password'] = password

            login(credentials)
        }
    }

    return (

        <div className='Login'>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Username: </Label>
                    <Input
                        type="text"
                        invalid={usernameErr}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Username"
                    />
                    <FormFeedback>Please enter your username!</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label>Password: </Label>
                    <Input
                        type="password"
                        invalid={passwordErr}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                    />
                    <FormFeedback>Please enter your password!</FormFeedback>
                </FormGroup>
                <Button type="submit" onClick={handleSubmit}>Login</Button>
                <Link to="/signup" style={{ color: "#22a9ba" }}>Create Account</Link>
            </Form>
        </div>
    )
}

export default Login;