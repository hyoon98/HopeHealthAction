import React, { useState, useEffect, useContext } from 'react';
import { Container, Button, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import CookieChecker from '../../components/CookieChecker';
import axios from 'axios';
import { UserContext } from '../../components/UserContext';
import { useHistory } from "react-router-dom";
import MapWithMarker  from '../../components/MapWithMarker';
import DeleteWithWarning from '../../components/DeleteWithWarning';
import AdminSideBar from '../../components/AdminSideBar';

function VisitInfo(props) {

    const [ visit, setVisit ] = useState({});
    const [ visitFound, setVisitFound ] = useState(false);
    const [ isAdmin, setIsAdmin ] = useState(false);
    const context = useContext(UserContext);
    const history = useHistory();
    document.title = "Visit Details";

    useEffect(() => {
        if(context.Role === 'Admin') {
            setIsAdmin(true)
        }
    }, [])

    useEffect(() => {

        axios.get('/visits/' + props.match.params.id)
        .then(response => {
            setVisit(response.data[0]);
            setVisitFound(true);
        })
        .catch(error => {
            console.log(error);
            document.title = "Visit not found";
        })
    },[])

    function previousPage(event) {
        event.preventDefault();
        history.goBack();
    }

    if(!visitFound){

        return(
            <div>
                <h1>Visit Not Found</h1>
            </div>
            
        )
    }
    return(
        <div>
            <CookieChecker></CookieChecker>
            <div className={`${isAdmin ? "main-content" : ""}`}>
                {isAdmin ? 
                <AdminSideBar/> 
                : ''}
                <div className={`${isAdmin ? "admin-container" : ""}`}>
                    <Container>
                        <Row>
                            <Col>
                                <Button onClick={(e) => previousPage(e)}>Back</Button>
                            </Col>
                            {(isAdmin) ? (
                                <div>
                                    <DeleteWithWarning visitId={props.match.params.id} clientId={visit.Client?.ClientId}/>
                                </div>
                            ): ""}
                        </Row>
                    </Container>
                    <br/>
                    <Container>
                        <Row>
                            <Col><h1>Summary:</h1></Col>
                        </Row>
                        <Row>
                            <Col>
                                {visit.Client ? (
                                    <h5><b>Client Name: </b>{visit.Client?.FirstName + ' ' + visit.Client?.LastName}</h5>
                                ) : ""}
                                {visit.Worker ? (
                                    <h5><b>Worker Name: </b>{visit.Worker?.FirstName + ' ' + visit.Worker?.LastName}</h5>
                                ) : ""}
                                <h5><b>Visit Purpose: </b>{visit.VisitPurpose}</h5>
                                <h5><b>Visit Date: </b>{visit.Date}</h5>
                                <h5><b>Location: </b>{visit.Location}</h5>
                                <h5><b>Village Number: </b>{visit.VillageNumber}</h5>
                            </Col>
                            {(visit.GPSLocation) ? (
                                <Col>
                                    <h5><b>GPS Location</b></h5>
                                    <MapWithMarker
                                        loadingElement={<div style={{ height: '75%' }} />}
                                        containerElement={<div style={{ height: '250px', width: '300px' }} />}
                                        mapElement={<div style={{ height: '90%' }} />}
                                        location={JSON.parse(visit.GPSLocation)}
                                    />
                                </Col>
                            ) : ("")}
                        </Row>
                    </Container>
                    <Container>
                        <Row>
                            <Col><h1>Visit Details:</h1></Col>
                        </Row>
                    </Container>
                    {visit.HealthForm !== null ?
                    <Container>
                        <Row>
                            <Col><h2>Health</h2></Col>
                        </Row>
                        <ListGroup>
                            {visit.HealthForm?.Wheelchair ?
                            <ListGroupItem><b>Wheelchair: </b><br/>{visit.HealthForm.Wheelchair}</ListGroupItem>
                            : ""}
                            {visit.HealthForm?.Prosthetic ?
                            <ListGroupItem><b>Prosthetic: </b><br/>{visit.HealthForm.Prosthetic}</ListGroupItem>
                            : ""}
                            {visit.HealthForm?.Orthotic ?
                            <ListGroupItem><b>Orthotic: </b><br/>{visit.HealthForm.Orthotic}</ListGroupItem>
                            : ""}
                            {visit.HealthForm?.WheelchairRepair ? 
                            <ListGroupItem><b>Wheelchair Repair: </b><br/>{visit.HealthForm.WheelchairRepair}</ListGroupItem>
                            : ""}
                            {visit.HealthForm?.HealthCenterReferral ? 
                            <ListGroupItem><b>Health Centre Referral: </b><br/>{visit.HealthForm.HealthCenterReferral}</ListGroupItem>
                            : ""}
                            {visit.HealthForm?.Advice ? 
                            <ListGroupItem><b>Advice: </b><br/>{visit.HealthForm.Advice}</ListGroupItem>
                            : ""}
                            {visit.HealthForm?.Advocacy ?
                            <ListGroupItem><b>Advocacy: </b><br/>{visit.HealthForm.Advocacy}</ListGroupItem>
                            : ""}
                            {visit.HealthForm?.Encouragement ?
                            <ListGroupItem><b>Encouragement: </b><br/>{visit.HealthForm.Encouragement}</ListGroupItem>
                            : ""}
                            {visit.HealthForm?.GoalMet ?
                            <ListGroupItem><b>Goal Met? </b><br/>{visit.HealthForm.GoalMet}</ListGroupItem>
                            : ""}
                            {visit.HealthForm?.GoalMet === "Concluded" ?
                            <ListGroupItem><b>Concluded Outcome</b><br/>{visit.HealthForm.ConcludedOutcome}</ListGroupItem>
                            : ""}
                        </ListGroup>
                    </Container>
                    : ""}
                    <br/>
                    {visit.EducationForm !== null ? 
                    <Container>
                        <Row>
                            <Col><h2>Education</h2></Col>
                        </Row>
                        <ListGroup>
                            {visit.EducationForm?.Advice ?
                            <ListGroupItem><b>Advice: </b><br/>{visit.EducationForm.Advice}</ListGroupItem>
                            : ""}
                            {visit.EducationForm?.Advocacy ?
                            <ListGroupItem><b>Advocacy: </b><br/>{visit.EducationForm.Advocacy}</ListGroupItem>
                            : ""}
                            {visit.EducationForm?.Encouragement ?
                            <ListGroupItem><b>Encouragement: </b><br/>{visit.EducationForm.Encouragement}</ListGroupItem>
                            : ""}
                            {visit.EducationForm?.OrganizationReferral ?
                            <ListGroupItem><b>Organization Referral: </b><br/>{visit.EducationForm.OrganizationReferral}</ListGroupItem>
                            : ""}
                            {visit.EducationForm?.GoalMet ?
                            <ListGroupItem><b>Goal Met? </b><br/>{visit.EducationForm.GoalMet}</ListGroupItem>
                            : ""}
                            {visit.EducationForm?.GoalMet === "Concluded" ?
                            <ListGroupItem><b>Concluded Outcome</b><br/>{visit.EducationForm.ConcludedOutcome}</ListGroupItem>
                            : ""}
                        </ListGroup>
                    </Container>
                    : ""}
                    <br/>
                    {visit.SocialForm !== null ?
                    <Container>
                        <Row>
                            <Col><h2>Social</h2></Col>
                        </Row>
                        <ListGroup>
                            {visit.SocialForm?.Advice ?
                            <ListGroupItem><b>Advice: </b><br/>{visit.SocialForm.Advice}</ListGroupItem>
                            : ""}
                            {visit.SocialForm?.Advocacy ?
                            <ListGroupItem><b>Advocacy: </b><br/>{visit.SocialForm.Advocacy}</ListGroupItem>
                            : ""}
                            {visit.SocialForm?.Encouragement ?
                            <ListGroupItem><b>Encouragement: </b><br/>{visit.SocialForm.Encouragement}</ListGroupItem>
                            : ""}
                            {visit.SocialForm?.OrganizationReferral ?
                            <ListGroupItem><b>Organization Referral: </b><br/>{visit.SocialForm.OrganizationReferral}</ListGroupItem>
                            : ""}
                            {visit.SocialForm?.GoalMet ?
                            <ListGroupItem><b>Goal Met? </b><br/>{visit.SocialForm.GoalMet}</ListGroupItem>
                            : ""}
                            {visit.SocialForm?.GoalMet === "Concluded" ?
                            <ListGroupItem><b>Concluded Outcome</b><br/>{visit.SocialForm.ConcludedOutcome}</ListGroupItem>
                            : ""}
                        </ListGroup>
                    </Container>
                    : ""}
                </div>
            </div>
        </div>
    )
}

export default VisitInfo;