import React,{useEffect} from 'react';

import { Container, Row, Col } from 'reactstrap';
import OutRefs from '../../components/OutRef';
import PriorityClients from '../../components/PriorityClients';
import ListWorkerAlerts from '../../components/ListWorkerAlerts';
import CookieChecker from '../../components/CookieChecker';
import '../../css/Dashboard.css';

function Dashboard() {

  useEffect(() => {
    document.title="CBR Dashboard"
  }, [])
  return (
    
    <div id="container">
      <CookieChecker></CookieChecker>
      <Container>
        <Row>
          <Col>
            <h1>CBR Dashboard</h1>
          </Col>
        </Row>
        <Row>
            <Col>
              <div className="priorityClient">
                <PriorityClients></PriorityClients>
              </div>
            </Col>
            <Col>
              <div className="outRefs">
                <OutRefs></OutRefs>
              </div>
            </Col>
            <Col>
              <div className="alerts">
                <ListWorkerAlerts/>
              </div>
            </Col>
        </Row>
      </Container>
    </div>
    
  )
}

export default Dashboard;