import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Media, Button } from 'reactstrap';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import CookieChecker from '../../components/CookieChecker';
import Modal from 'react-modal';
import { FieldInput } from "../../components/MultiStepForm";
import { Formiz, useForm } from '@formiz/core';
import { UserContext } from '../../components/UserContext';
import moment from 'moment';
import DeleteWithWarning from '../../components/DeleteWithWarning';
import AdminSideBar from '../../components/AdminSideBar';

function ReferralInfo(props){

    let formState = useForm();

    const [referral, setReferral]= useState({});
    const [resolveModalOpen, setResolveModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const context = useContext(UserContext);
    const history = useHistory();
    const formContainerSize={
        margin: 'auto',
        maxWidth: 800
    }

    // Reference: https://www.npmjs.com/package/react-modal
    const customStyles = {
        content : {
          position: 'relative',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)'
        }
    };

    useEffect(() => {
        if(context.Role === 'Admin'){
            setIsAdmin(true)
        }
    })

    useEffect(() => {
        document.title='Referral Info' 
        axios.get('/referrals/' + props.match.params.id)
        .then(response => {
            setReferral(response.data[0]);
        })
        .catch(error => {
            console.log(error);
            document.title = "Referral not found";
        })
      }, [])
    
    function previousPage(event) {
        event.preventDefault();
        history.goBack();
    }
    
    function openModal() {
        setResolveModalOpen(true);
    }

    function closeModal() {
        setResolveModalOpen(false);
    }

    function resolveReferral(data) {
        axios.put('/referrals/' + props.match.params.id + '/edit', data)
        .then(response => {
            closeModal();
            alert("Referral has been resolved")
            window.location.reload()
        })
        .catch(err => {
            console.log(err);
            closeModal();
            alert("Something went wrong when trying to resolve the referral");
        })
    }

    function ServiceHandler( props ){
        switch(props.service){
        case 'Physiotherapy' :
            return(
                <>
                <hr/>
                <Row>
                    <Col>
                        <h3 className='font-weight-bold' style={{fontSize: '22px'}}>Physiotherapy</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="text-center">
                            <Media src={`data:image/jpeg;base64,${referral.PhysiotherapyService.Photo}`} object alt="Image" className="rounded-circle rounded" style={{height: "200px", width: "200px"}}/>
                        </div>
                    </Col>
                    <Col>
                        <span className='font-weight-bold' style={{fontSize: '18px'}}>Conditions: </span>
                        {referral.PhysiotherapyService.ClientCondition.join(', ')}
                        <br/>
                        <span className='font-weight-bold' style={{fontSize: '18px'}}>Other Conditions: </span>
                        {referral.PhysiotherapyService.OtherClientCondition}
                    </Col>
                </Row>
                <hr/>
                </>
            )

        case 'Prosthetic':
            return(
                <>
                <hr/>
                <Row>
                    <Col>
                        <h3 className='font-weight-bold' style={{fontSize: '22px'}}>Prosthetic</h3>
                    </Col>
                </Row>
                <Row>
                {referral.ProstheticService.Photo ?
                    <Col>
                        <Media src={`data:image/jpeg;base64,${referral.ProstheticService.Photo}`} object alt="Profile Image" className="rounded-circle rounded" style={{height: "200px", width: "200px"}}/>
                    </Col>
                    : ""}
                    <Col>
                        <span className='font-weight-bold' style={{fontSize: '18px'}}>Injury Position: </span>
                        {referral.ProstheticService.InjuryPosition}
                    </Col>
                </Row>
                <hr/>
                </>
            )
        case 'Orthotic':
            return(
                <>
                <hr/>
                <Row>
                    <Col>
                        <h3 className='font-weight-bold' style={{fontSize: '22px'}}>Orthotic</h3>
                    </Col>
                </Row>
                <Row>
                {referral.OrthoticService.Photo ?
                    <Col>
                        <Media src={`data:image/jpeg;base64,${referral.OrthoticService.Photo}`} object alt="Profile Image" className="rounded-circle rounded" style={{height: "200px", width: "200px"}}/>
                    </Col>
                    :""}
                    <Col>
                        <span className='font-weight-bold' style={{fontSize: '18px'}}>Injury Position: </span>
                        {referral.OrthoticService.InjuryPosition}
                    </Col>
                </Row>
                <hr/>
                </>
            )
        case 'Wheelchair':
            return(
            <>
            <hr/>
            <Row>
                <Col>
                    <h3 className='font-weight-bold' style={{fontSize: '22px'}}>Wheelchair</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                <Media src={`data:image/jpeg;base64,${referral.WheelchairService.Photo}`} object alt="Profile Image" className="rounded-circle rounded" style={{height: "200px", width: "200px"}}/>
                </Col>
                <Col>
                    <h3 className='font-weight-bold' style={{fontSize: '18px'}}>Details: </h3>
                    <ul class='list-unstyled'>
                        <li>- Basic/Intermediate User: {referral.WheelchairService.ClientProficiency}</li>
                        <li>- Hip Width (Inches): {referral.WheelchairService.ClientHipWidth}</li>
                        <li>- Existing Wheelchair: {referral.WheelchairService.WheelchairExist}</li>
                        {referral.WheelchairService.WheelchairExist==='Y'?
                            <li>- Wheelchair Repairable: {referral.WheelchairService.WheelchairRepairable}</li>:null}
                    </ul>
                </Col>
            </Row>
            <hr/>
            </>
            )

        case 'Other':
            return(
            <>
            <hr/>
            <Row>
                <Col>
                    <h3 className='font-weight-bold' style={{fontSize: '22px'}}>Other</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <span className='font-weight-bold' style={{fontSize: '18px'}}>Details: </span>
                    {referral.OtherServices}
                </Col>
            </Row>
            <hr/>
            </>
            )
        }
    }

    return(
        <div className={`${isAdmin ? "main-content" : ""}`}>
            {isAdmin ? 
                <AdminSideBar/> 
                : ''}
            <Container>
                <div className={`${isAdmin ? "admin-container" : ""}`} style={formContainerSize}>
                    <CookieChecker></CookieChecker>
                    <Row>
                        <Col>
                            <Button onClick={(e) => previousPage(e)}>Back</Button>
                        </Col>
                        <Col style={{display: 'inline'}}>
                        {(isAdmin) ? (
                                <div>
                                    <DeleteWithWarning referralId={props.match.params.id} clientId={referral.Client?.ClientId}/>
                                </div>
                            ) : ""}
                            
                            {!isAdmin ?
                            <Button onClick={openModal} style={{float: 'right',  marginRight: '5px'}}>Resolve</Button>
                            : ''}
                            <Modal
                            isOpen={resolveModalOpen}
                            onRequestClose={closeModal}
                            style={customStyles}>
                                <Container>
                                    <Formiz connect={formState} onValidSubmit={resolveReferral}>
                                        <form onSubmit={formState.submit}>
                                            <h4>Resolve Referral</h4>
                                            <FieldInput label="Status" type="select" name="Status" required="A selection is required" defaultValue={"Resolved"} disabled>
                                                <option hidden selected>Choose a status</option>
                                                <option>Made</option>
                                                <option>Resolved</option>
                                            </FieldInput>
                                            <FieldInput label="Outcome" type="textarea" name="Outcome" placeholder="What was the outcome?" required="Outcome is required" 
                                            defaultValue={referral.Outcome || ""}/>
                                            <Button type="submit">Submit</Button>
                                            <Button onClick={closeModal} style={{float: 'right'}}>Close</Button>
                                        </form>
                                    </Formiz>
                                </Container>
                            </Modal>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col><h1>Referral</h1></Col>
                    </Row>
                    <Row>
                        <Col><h5><b>Client Name: </b>{referral.Client?.FirstName + ' ' + referral.Client?.LastName}</h5></Col>
                    </Row>
                    <Row>
                        <Col><h5><b>Date: </b>{moment(referral.Date).format('DD-MM-YYYY')}</h5></Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5><b>Status: </b>
                            <div style={{display: 'inline', color: (referral.Status === 'Made') ? ('red') : ('green')}}>{referral.Status}</div>
                            </h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5><b>Services: </b>{referral.ServiceRequired && referral.ServiceRequired.join(', ')}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5><b>Service Center: </b>{referral.ReferTo}</h5>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col><h1>Details</h1></Col>
                    </Row>
                    {referral.ServiceRequired && (referral.ServiceRequired.map((service)=>{
                        return(
                            <ServiceHandler service={service}/>
                    )}))}
                </div>
            </Container>
        </div>
    );
}

export default ReferralInfo