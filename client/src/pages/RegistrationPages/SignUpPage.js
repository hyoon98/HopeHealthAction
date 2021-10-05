import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, FormFeedback, FormText, Input, Label } from 'reactstrap';
import axios from 'axios'
import "../../css/SignUp.css";

function SignUpPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [location, setLocation] = useState("");
    const [photo, setPhoto] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstNameErr, setFirstNameErr] = useState(false);
    const [lastNameErr, setLastNameErr] = useState(false);
    const [locationErr, setLocationErr] = useState(false);
    const [usernameErr, setUsernameErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);

    useEffect(() => {
        document.title = "Create CBR Account"
    }, [])

    function initialErrState() {
        setFirstNameErr(false)
        setLastNameErr(false)
        setLocationErr(false)
        setUsernameErr(false)
        setPasswordErr(false)
        setConfirmPasswordErr(false)
    }

    function createUser() {
        const formData = new FormData()

        formData.append('FirstName', firstName)
        formData.append('LastName',lastName)
        formData.append('Location', location)
        formData.append('Username', username)
        formData.append('Password', password)
        formData.append('Photo', photo)

        return formData;
    }

    function userCredentials() {
        let credentials = {}
        credentials['Username'] = username
        credentials['Password'] = password

        return credentials;
    }


    async function login(user) {
        axios.post('/users/login', user)
            .then(res => {
                const maxAge = 60 * 60; // 60 mins
                document.cookie = "cookiename=cookievalue;max-age=" + (maxAge);
                axios.get('users/session', { params: { username: user['Username'] } })
                    .then(res => {
                        document.cookie = `Username=${username};max-age=` + (maxAge);
                        document.cookie = `Role=${res.data[0].Role};max-age=` + (maxAge);
                        document.cookie = `WorkerId=${res.data[0].WorkerId};max-age=` + (maxAge);
                    })
                    .catch(err => console.log(err))
                window.location.replace("/");
                console.log(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }

    function authPasses() {
        var isPass = true
        if (firstName.length <= 0) {
            setFirstNameErr(true)
            isPass = false
        }
        if (lastName.length <= 0) {
            setLastNameErr(true)
            isPass = false
        }
        if(location.length <= 0) {
            setLocationErr(true)
            isPass = false
        }
        if (username.length <= 0) {
            setUsernameErr(true)
            isPass = false
        }
        if (password.length <= 5) {
            setPasswordErr(true)
            isPass = false
        }
        if (confirmPassword !== password) {
            setConfirmPasswordErr(true)
            isPass = false
        }
        return isPass
    }

    async function registerApiCall(user) {
        axios.post('/users/register', user, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
            .then(res => {
                const REGISTERED = '3'
                if (res.data == REGISTERED) {
                    alert("Username is already taken")
                    return;
                }
                else{
                    alert("User is successfully registered");
                    const credentials = userCredentials();
                    login(credentials);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }


    async function handleSubmit(event) {
        event.preventDefault();
        initialErrState();
        if (authPasses()) {
            const user = createUser();
            registerApiCall(user);
            return;
        }
    }

    return (
        <div className='SignUp'>
            <Form onSubmit={handleSubmit}>
                <h2><b>Create CBR Account</b></h2>
                <FormGroup>
                    <Label for="firstName">First name</Label>
                    <Input invalid={firstNameErr} type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="First name" />
                    <FormFeedback>Please enter your first name!</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="lastName">Last name</Label>
                    <Input invalid={lastNameErr} type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Last name" />
                    <FormFeedback>Please enter your last name!</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="userName">Username</Label>
                    <Input invalid={usernameErr} type="text"
                        id="userName"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Username" />
                    <FormFeedback>Please enter a username!</FormFeedback>
                    <FormText><i>Add username to easily log in</i></FormText>
                </FormGroup>
                <FormGroup>
                    <Label for="profilePhoto">Profile Picture</Label>
                    <Input
                        type="file"
                        name="profilePhoto"
                        id="profilePhoto"
                        onChange={(event) => setPhoto(event.target.files[0])}
                    />
                    <FormText><i>Optional</i></FormText>
                </FormGroup>
                <FormGroup>
                    <Label for="location">Location</Label>
                    <Input invalid={locationErr} type="select"
                        id="location"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}>
                        <option hidden>Choose a location </option>    
                        <option>BidiBidi Zone 1</option>
                        <option>BidiBidi Zone 2</option>
                        <option>BidiBidi Zone 3</option>
                        <option>BidiBidi Zone 4</option>
                        <option>BidiBidi Zone 5</option>
                        <option>Palorinya Basecamp</option>
                        <option>Palorinya Zone 1</option>
                        <option>Palorinya Zone 2</option>
                        <option>Palorinya Zone 3</option>
                    </Input>
                    <FormText><i>Choose your assigned zone.</i></FormText>
                    <FormFeedback>Please choose a location!</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input invalid={passwordErr} type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password" />
                    <FormFeedback>Password must be more than 5 characters</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input invalid={confirmPasswordErr} type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm password" />
                    <FormFeedback>Passwords don't match</FormFeedback>
                </FormGroup>
                <Button
                    type="submit" id="submitBtn" onClick={handleSubmit}>Create Account</Button>
                <Link to="/login" style={{ color: "#22a9ba" }}>Login instead</Link>
            </Form>
        </div>
    )
}

export default SignUpPage;
