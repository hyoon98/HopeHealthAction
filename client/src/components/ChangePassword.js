import React, { useContext, useState } from 'react';
import { Row, Col, Container, Button, FormFeedback, FormGroup, Input, Label, Modal } from 'reactstrap';
import axios from 'axios';
import { UserContext } from './UserContext';

function ChangePassword(props) {

    const context = useContext(UserContext);

    const {username} = props;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    function openModal() {
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMatch(true);
    }

    function validInputs() {
        if (newPassword.length <= 5)
        {
            setValidPassword(false);
            return false;
        }
        setValidPassword(true);

        if (newPassword !== confirmPassword)
        {
            setPasswordMatch(false);
            return false;
        }
        setPasswordMatch(true);

        return true;
    }

    function changeUserPassword(event) {
        event.preventDefault();

        if (!validInputs()) {
            return;
        }
        
        let request = {};

        request['Username'] = username;
        request['New_Password'] = newPassword;
        request['Role'] = context.Role;
        
        axios.put('/users/changepw', request)
            .then((response) => {
                alert("Password changed");
                closeModal()
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 409)
                    alert("New password must be different from current password");
                else
                    alert("Something went wrong");
            })
    }

    return (
        <Row className='right-button'>
            <Col>
                <Button onClick={openModal} className='right-button'>Change Password</Button>
                <Modal
                    isOpen={modalOpen}
                    onRequestClose={closeModal}>
                    <h4>Change password</h4>
                    <Container>
                        <form onSubmit={changeUserPassword}>
                            <FormGroup>
                                <Label>New Password</Label>
                                <Input
                                    invalid={!validPassword}
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    placeholder="New Password"
                                />
                                <FormFeedback>Enter a valid password (at least 6 characters)</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label>Confirm Password</Label>
                                <Input
                                    invalid={!passwordMatch}
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Confirm Password"
                                />
                                <FormFeedback>Passwords must match</FormFeedback>
                            </FormGroup>
                            <Button type="submit" onClick={changeUserPassword}>Submit</Button>
                            <Button onClick={closeModal} className='right-button'>Close</Button>
                        </form>
                        <br/>
                    </Container>
                </Modal>
            </Col>
        </Row>
    )
}

export default ChangePassword;