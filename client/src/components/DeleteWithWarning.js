import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Row, Col } from 'reactstrap';
import Modal from 'react-modal';

function WarningModal(props) {

    const { clientId, referralId, visitId, toDeleteSurvey } = props;

    const [ modelOpen, setModalOpen ] = useState(false);

    // Reference: https://www.npmjs.com/package/react-modal
    const customStyles = {
        content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)'
        }
    };

    function openModal() {
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
    }

    function deleteClient(event) {
        event.preventDefault();

        axios.delete('/clients/delete/' + clientId)
            .then(() => {
                closeModal();
                window.location.replace('/client-list');
            })
            .catch(err => {
                console.log(err);
                closeModal();
                alert("Something went wrong when deleting the client")
            })
    }

    function deleteReferral(event) {
        event.preventDefault();

        axios.delete('/referrals/delete/' + referralId)
            .then(() => {
                closeModal();
                window.location.replace('/client/'+ clientId);
            })
            .catch(err => {
                console.log(err);
                closeModal();
                alert("Something went wrong when deleting the referral")
            })
    }

    function deleteVisit(event) {
        event.preventDefault();

        axios.delete('/visits/delete/' + visitId)
            .then(() => {
                closeModal();
                window.location.replace('/client/'+ clientId);
            })
            .catch(err => {
                console.log(err);
                closeModal();
                alert("Something went wrong when deleting the visit")
            })
    }

    function deleteSurvey(event) {
        event.preventDefault();

        axios.delete('/baselineSurveys/' + clientId + '/delete') 
            .then(() => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong when deleting the client")
            })
    }

    return (
        <div>
            <Button onClick={openModal} style={{float: (toDeleteSurvey) ? 'left' : 'right'}} color="danger">
                Delete 
                {(referralId) ? " Referral"
                : (visitId) ? " Visit"
                : (toDeleteSurvey) ? " Survey"
                : (clientId) ? " Client"
                : ""}
            </Button>
            <Modal
            isOpen={modelOpen}
            onRequestClose={closeModal}
            style={customStyles}
            >
                <Container>
                    <Row>
                        <Col>Are you sure you want to delete this 
                        {(referralId) ? " referral"
                        : (visitId) ? " visit"
                        : (toDeleteSurvey) ? " baseline survey"
                        : (clientId) ? " client"
                        : ""}
                        ?</Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col><Button color="success" onClick={
                            referralId ? deleteReferral
                            : visitId ? deleteVisit
                            : (toDeleteSurvey) ? deleteSurvey
                            : clientId ? deleteClient
                            : ""
                        }>Yes</Button></Col>
                        <Col><Button color="danger" style={{float: 'right'}} onClick={closeModal}>No</Button></Col>
                    </Row>                           
                </Container>
            </Modal>
        </div>
    )
}

export default WarningModal;