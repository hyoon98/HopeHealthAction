import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  Label,
  UncontrolledAlert,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import "../css/CreateNewAdmin.css";

function CreateAdminAccount(props) {
  const { onClick, onSuccess } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [registerSuccessful, setRegisterSuccessful] = useState(false);

  const [usernameErr, setUsernameErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(false);

  function initialErrState() {
    setUsernameErr(false);
    setPasswordErr(false);
    setConfirmPasswordErr(false);
    setUsernameTaken(false);
  }

  function authPasses() {
    var isPass = true;
    if (username.length <= 0) {
      setUsernameErr(true);
      isPass = false;
    }
    if (password.length <= 5) {
      setPasswordErr(true);
      isPass = false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordErr(true);
      isPass = false;
    }
    return isPass;
  }

  function getUser() {
    let user = {};
    user["Username"] = username;
    user["Password"] = password;
    user['Role'] = "Admin";

    return user;
  }

  function createUser(user) {
    axios
      .post("/users/register", user)
      .then((res) => {
        const REGISTERED = "3";
        if (res.data == REGISTERED) {
          setUsernameTaken(true);
        } else {
          setRegisterSuccessful(true);
          setTimeout(() => {
            onSuccess();
          }, 1000)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSubmit(event) {
    event.preventDefault();
    initialErrState();
    if (authPasses()) {
      const user = getUser();
      createUser(user);
    }
  }

  return (
    <div className="form-background">
      <div className="form-wrapper">
        {usernameTaken && (
          <UncontrolledAlert color="danger">
            Username is already taken!
          </UncontrolledAlert>
        )}
        {registerSuccessful && (
          <UncontrolledAlert color="success">
            Account created successfully!
          </UncontrolledAlert>
        )}
        <button
          onClick={(e) => {
            if (onClick) onClick(e);
          }}
        >
          &times;
        </button>
        <Form onSubmit={handleSubmit}>
          <h4>
            <b>Create New Admin</b>
          </h4>
          <div className="form-content">
            <Row form>
              <Col sm={12}>
                <FormGroup>
                  <Label for="userName">Username</Label>
                  <Input
                    invalid={usernameErr}
                    type="text"
                    id="userName"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Username"
                  />
                  <FormFeedback>Please enter a username!</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col sm={12}>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    invalid={passwordErr}
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                  />
                  <FormFeedback>
                    Password must be more than 5 characters
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col sm={12}>
                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Input
                    invalid={confirmPasswordErr}
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm password"
                  />
                  <FormFeedback>Passwords don't match</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Button type="submit" onClick={handleSubmit}>
              Create Account
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CreateAdminAccount;
