import React, {useContext, useEffect, useState} from 'react';
import {ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Button} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { UserContext } from '../components/UserContext';

import "../css/ListWorkerAlerts.css";

function ListWorkerAlerts(props) {

    const [ alerts, setAlerts ] = useState([]);

    const context = useContext(UserContext);

    useEffect(() => {
        pullAlerts()
    },[])

    function pullAlerts() {
        axios.get('/alerts/worker/' + context.WorkerId)
        .then(response => {
            setAlerts(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    function renderRow(alert) {
        return (
            <ListGroupItem key={alert.AlertId}>
                <ListGroupItemHeading className="listHeader"><b>{alert.Title}</b></ListGroupItemHeading>
                <ListGroupItemText>
                    <p className="dateText"><i>Sent {moment(alert.Date).format('DD-MM-YYYY')}</i></p>
                    <p className="messageText">{alert.Message}</p>
                </ListGroupItemText>
            </ListGroupItem>
        );
    }

    return (
        <div>
            <h4>Alerts</h4>
            <Button onClick={pullAlerts} className="button">Refresh</Button>
            <div className="list">
                <ListGroup>
                    {alerts.length > 0 ? alerts.map(renderRow) :
                        <ListGroupItem>No alerts to show</ListGroupItem>}
                </ListGroup>
            </div>
        </div>
    );
}

export default ListWorkerAlerts;