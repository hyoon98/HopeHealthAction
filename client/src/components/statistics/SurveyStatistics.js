import React, { useEffect, useState } from 'react';
import { Container, Table, Label, Input, TabContent, TabPane,
Nav, NavItem, NavLink, Button, Row, FormGroup } from 'reactstrap'
import classnames from 'classnames';
import axios from 'axios';
import '../../css/SurveyStatistics.css';

function ReferralStatistics() {

  const [activeTab, setActiveTab] = useState('1');
  const toggle = (tab) => { if (activeTab !== tab) setActiveTab(tab); }

  const [ filteredStats, setFilteredStats ] = useState([]);
  const [ allStats, setAllStats ] = useState([]);
  const [ searchLocation, setSearchLocation ] = useState('');
  const [ searchDisability, setSearchDisability ] = useState('');

  const [ isSelectionAllowed, setIsSelectionAllowed ] = useState(true);

  const [ total, setTotal ] = useState(1);

  useEffect(() => {
    axios.get('/surveyStats/')
    .then((response) => {
      setFilteredStats(response.data);
      setTotal(response.data.Total);
      setAllStats(response.data);
      setIsSelectionAllowed(true);
    })
    .catch((error) => {
      console.log("api error",error);
      setIsSelectionAllowed(true);
    })
  }, [])

  function getAllSurveyStats() {
    setFilteredStats(allStats);
    setTotal(allStats.Total);
    resetFilters();
  }

  function getStatsByDisability(inputDisability) {
    setSearchDisability(inputDisability);
    if (searchLocation !== '') {
      getStatsByLocationAndDisability(searchLocation, inputDisability);
      return;
    }
    axios.get('/surveyStats/disability/'+inputDisability)
    .then((response) => {
      setFilteredStats(response.data);
      setTotal(response.data.Total);
      setIsSelectionAllowed(true);
    })
    .catch((error) => {
      console.log("api error",error);
      setIsSelectionAllowed(true);
    })
  }

  function getStatsByLocation(inputLocation) {
    setSearchLocation(inputLocation);
    if (searchDisability !== '') {
      getStatsByLocationAndDisability(inputLocation, searchDisability);
      return;
    }

    axios.get('/surveyStats/location/'+inputLocation)
    .then((response) => {
      setFilteredStats(response.data);
      setTotal(response.data.Total);
      setIsSelectionAllowed(true);
    })
    .catch((error) => {
      console.log("api error",error);
      setIsSelectionAllowed(true);
    })
  }

  function getStatsByLocationAndDisability(inputLocation, inputDisability) {
    axios.get('/surveyStats/'+inputLocation+'/'+inputDisability)
    .then((response) => {
      setFilteredStats(response.data);
      setTotal(response.data.Total);
      setIsSelectionAllowed(true);
    })
    .catch((error) => {
      console.log("api error",error);
      setIsSelectionAllowed(true);
    })
  }

  function changeLocation(inputLocation) {
    setIsSelectionAllowed(false);
    getStatsByLocation(inputLocation);
  }

  function changeDisability(inputDisability) {
    setIsSelectionAllowed(false);
    getStatsByDisability(inputDisability);
  }

  function resetFilters() {
    setSearchDisability('');
    setSearchLocation('');
  }

  function getPercent(num, denom) {
    return Math.round((num/denom) * 100);
  }

  function ShowHealthStats() {
    const HealthStats = filteredStats['HealthStats'];

    return(
    <div>
      <Table size="sm">
        <thead>
          <tr>
            <th>Stats</th>
            <th>Description</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>{getPercent(HealthStats?.RehabilitationAccessCount, total)}%</td>
            <td>Has access to rehabilitation services</td>
          </tr>
          <tr>
            <td>{getPercent(HealthStats?.RehabilitationAccessNeededCount, total)}%</td>
            <td>Needs access to rehabilitation services</td>
          </tr>
          <tr>
            <td>{getPercent(HealthStats?.AssistiveDeviceCount, total)}%</td>
            <td>Has assistive device</td>
          </tr>
          <tr>
            <td>{getPercent(HealthStats?.AssistiveDeviceWorkingCount, total)}%</td>
            <td>Assistive device working</td>
          </tr>
          <tr>
            <td>{getPercent(HealthStats?.AssistiveDeviceNeededCount, total)}%</td>
            <td>Assistive device needed</td>
          </tr>
        </tbody>
      </Table>
    </div>
    );
  }

  function ShowSocialStats() {
    const SocialStats = filteredStats['SocialStats'];
    return(
      <div>
        <Table size="sm">
          <thead>
            <tr>
              <th>Stats</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{getPercent(SocialStats?.ValuedCommunityMemberCount, total)}%</td>
              <td>Feel valued as a community member</td>
            </tr>
            <tr>
              <td>{getPercent(SocialStats?.IndependenceCount, total)}%</td>
              <td>Feel independent</td>
            </tr>
            <tr>
              <td>{getPercent(SocialStats?.CommunityParticipationCount, total)}%</td>
              <td>Able to participate in community/social events</td>
            </tr>
            <tr>
              <td>{getPercent(SocialStats?.DisabilityImpactCount, total)}%</td>
              <td>Disability affects ability to interact socially</td>
            </tr>
            <tr>
              <td>{getPercent(SocialStats?.DiscriminationCount, total)}%</td>
              <td>Experienced discrimination because of your disability</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  function ShowEducationStats() {
    const EducationStats = filteredStats['EducationStats'];

    return(
      <div>
        <Table size="sm">
          <thead>
            <tr>
              <th>Stats</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{getPercent(EducationStats?.SchoolStateCount, total)}%</td>
              <td>Goes to school</td>
            </tr>
            <tr>
              <td>{getPercent(EducationStats?.WantSchoolCount, total)}%</td>
              <td>Has ever attended school</td>
            </tr>
            <tr>
              <td>{getPercent(EducationStats?.SchoolBeforeCount, total)}%</td>
              <td>Wants to go to school</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  function ShowLivelihoodStats() {
    const LivelihoodStats = filteredStats['LivelihoodStats'];

    return(
      <div>
        <Table size="sm">
          <thead>
            <tr>
              <th>Stats</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{getPercent(LivelihoodStats?.WorkStatusCount, total)}%</td>
              <td>Currently working</td>
            </tr>
            <tr>
              <td>{getPercent(LivelihoodStats?.FinancialNeedsMetCount, total)}%</td>
              <td>Meet financial needs with current work</td>
            </tr>
            <tr>
              <td>{getPercent(LivelihoodStats?.DisabilityImpactCount, total)}%</td>
              <td>Disability affects ability to work</td>
            </tr>
            <tr>
              <td>{getPercent(LivelihoodStats?.WorkWantedCount, total)}%</td>
              <td>Wants to work</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  function ShowNutritionStats() {
    const NutritionStats = filteredStats['NutritionStats'];

    return(
      <div>
        <Table size="sm">
          <thead>
            <tr>
              <th>Stats</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{getPercent(NutritionStats?.MonthlyFoodAccessCount, total)}%</td>
              <td>Have enough food every month</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  function ShowEmpowermentStats() {
    const EmpowermentStats = filteredStats['EmpowermentStats'];

    return(
      <div>
        <Table size="sm">
          <thead>
            <tr>
              <th>Stats</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{getPercent(EmpowermentStats?.DisabilityOrganizationMemberCount, total)}%</td>
              <td>Is a member of a disability organization</td>
            </tr>
            <tr>
              <td>{getPercent(EmpowermentStats?.AwareDisabilityRightsCount, total)}%</td>
              <td>Aware of rights</td>
            </tr>
            <tr>
              <td>{getPercent(EmpowermentStats?.InfluentialCount, total)}%</td>
              <td>Feel able to influence people around</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  function ShowShelterStats() {
    const ShelterStats = filteredStats['ShelterStats'];

    return(
      <div>
        <Table size="sm">
          <thead>
            <tr>
              <th>Stats</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{getPercent(ShelterStats?.ShelterAccessCount, total)}%</td>
              <td>Adequate shelter</td>
            </tr>
            <tr>
              <td>{getPercent(ShelterStats?.EssentialsAccessCount, total)}%</td>
              <td>Access to essential household items</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

    return (
      <Container>
      <Row>
        <FormGroup>
          <Label>Location</Label>
          <Input type="select" value={searchLocation} disabled={!isSelectionAllowed}
            onChange={(event) => changeLocation(event.target.value)}>
            <option value="" disabled>Any Location</option>
            <option value="BidiBidi Zone 1">BidiBidi Zone 1</option>
            <option value="BidiBidi Zone 2">BidiBidi Zone 2</option>
            <option value="BidiBidi Zone 3">BidiBidi Zone 3</option>
            <option value="BidiBidi Zone 4">BidiBidi Zone 4</option>
            <option value="BidiBidi Zone 5">BidiBidi Zone 5</option>
            <option value="Palorinya Basecamp">Palorinya Basecamp</option>
            <option value="Palorinya Zone 1">Palorinya Zone 1</option>
            <option value="Palorinya Zone 2">Palorinya Zone 2</option>
            <option value="Palorinya Zone 3">Palorinya Zone 3</option>
          </Input>
        </FormGroup>
          <FormGroup>
            <Label>Disability Type</Label>
            <Input type="select"
              value={searchDisability} disabled={!isSelectionAllowed}
              onChange={(event) => changeDisability(event.target.value)}>
              <option value="" disabled>Any Disability</option>
                <option value="Amputee">Amputee</option>
                <option value="Polio">Polio</option>
                <option value="Spinal Cord Injury">Spinal Cord Injury</option>
                <option value="Cerebral Palsy">Cerebral Palsy</option>
                <option value="Spina Bifida">Spina Bifida</option>
                <option value="Hydrocephalus">Hydrocephalus</option>
                <option value="Visual Impairment">Visual Impairment</option>
                <option value="Hearing Impairment">Hearing Impairment</option>
                <option value="Don't Know">Don't Know</option>
                <option value="Other">Other</option>
            </Input>
          </FormGroup>
          <Button onClick={getAllSurveyStats} className="reset-button">Remove filters</Button>
        </Row>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}>
              Health
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}>
              Social
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => { toggle('3'); }}>
              Education
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '4' })}
              onClick={() => { toggle('4'); }}>
              Livelihood
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '5' })}
              onClick={() => { toggle('5'); }}>
              Empowerment
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '6' })}
              onClick={() => { toggle('6'); }}>
              Other Stats
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane className="tab-content" tabId="1">
            {(total === 0) ? <h4>No Stats</h4> : <ShowHealthStats/>}
          </TabPane>
          <TabPane className="tab-content" tabId="2">
            {(total === 0) ? <h4>No Stats</h4> : <ShowSocialStats/>}
          </TabPane>
          <TabPane className="tab-content" tabId="3">
            {(total === 0) ? <h4>No Stats</h4> : <ShowEducationStats/>}
          </TabPane>
          <TabPane className="tab-content" tabId="4">
            {(total === 0) ? <h4>No Stats</h4> : <ShowLivelihoodStats/>}
          </TabPane>
          <TabPane className="tab-content" tabId="5">
            {(total === 0) ? <h4>No Stats</h4> : <ShowEmpowermentStats/>}
          </TabPane>
          <TabPane className="tab-content" tabId="6">
            {(total === 0) ? <h4>No Stats</h4> :
              <div><h4>Nutrition Stats</h4>
              <ShowNutritionStats/>
              <h4>Shelter Stats</h4>
              <ShowShelterStats/></div>}
          </TabPane>
        </TabContent>
        <h5 className="total">Total Records: {total}</h5>
      </Container>
    )
}

export default ReferralStatistics;