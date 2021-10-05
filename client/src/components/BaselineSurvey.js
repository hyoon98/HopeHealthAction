import React, { useState } from 'react';
import { Row, Col, Table } from 'reactstrap';

function BaselineSurvey(props){

  let { baselineSurvey, surveyType } = props;
  let [ surveyFound, setSurveyFound ] = useState(true);

  function InsertYesOrNoImg(props) {
      if (typeof props.bool == undefined) {
          return (<td>--</td>);
      }
      if (props.bool) {
          //image: https://www.flaticon.com/free-icon/check-mark_1722017
          return (<td> <img src="/checkmark.png" style={{width:22}}/> </td>);
      }
      return (<td> <img src="/redX.png" style={{width:22}}/> </td>);
  }

  function InsertSpecificSurvey() {
      switch(surveyType) {
          case 'Health':
              return HealthSurvey();
          case 'Social':
              return SocialSurvey();
          case 'Education':
              return EducationSurvey();
          case 'Livelihood':
              return LivelihoodSurvey();
          case 'Food/Nutrition':
              return NutritionSurvey();
          case 'Empowerment':
              return EmpowermentSurvey();
          case 'Shelter/Care':
              return ShelterSurvey();
      }
      return null;
  }

  function HealthSurvey() {
      const HealthSurvey = baselineSurvey['HealthSurvey'];
      setSurveyFound(HealthSurvey !== null);
      return(
          <div>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Inquiry</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>General Health</td>
                    <td>{HealthSurvey?.HealthStatus ? HealthSurvey.HealthStatus : "--"}</td>
                  </tr>
                  <tr>
                    <td>Current access to rehabilitation services</td>
                    <InsertYesOrNoImg bool={HealthSurvey?.RehabilitationAccess}/>
                  </tr>
                  <tr>
                    <td>Need for access to rehabilitation services</td>
                    <InsertYesOrNoImg bool={HealthSurvey?.RehabilitationAccessNeeded}/>
                  </tr>
                  <tr>
                    <td>Has assistive device</td>
                    <InsertYesOrNoImg bool={HealthSurvey?.AssistiveDevice}/>
                  </tr>
                  <tr>
                    <td>Assistive device working</td>
                    <InsertYesOrNoImg bool={HealthSurvey?.AssistiveDeviceWorking}/>
                  </tr>
                  <tr>
                    <td>Assistive device needed</td>
                    <InsertYesOrNoImg bool={HealthSurvey?.AssistiveDeviceNeeded}/>
                  </tr>
                  <tr>
                    <td>Which assistive device needed</td>
                    <td> {HealthSurvey?.AssistiveDeviceRequired ? (HealthSurvey.AssistiveDeviceRequired.join(', ')) : "--"}</td>
                  </tr>
                  <tr>
                    <td>Satisfaction with current health services</td>
                    <td>{HealthSurvey?.HealthServiceStatus ? HealthSurvey.HealthServiceStatus : "--" }</td>
                  </tr>
                </tbody>
              </Table>
          </div>
      );
  }

  function SocialSurvey() {
      const SocialSurvey = baselineSurvey['SocialSurvey'];
      setSurveyFound(SocialSurvey !== null);
      return(
          <div>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Inquiry</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Feel valued as a community member</td>
                      <InsertYesOrNoImg bool={SocialSurvey?.ValuedCommunityMember}/>
                  </tr>
                  <tr>
                    <td>Feel independent</td>
                      <InsertYesOrNoImg bool={SocialSurvey?.Independence}/>
                  </tr>
                  <tr>
                    <td>Able to participate in community/social events</td>
                      <InsertYesOrNoImg bool={SocialSurvey?.CommunityParticipation}/>
                  </tr>
                  <tr>
                    <td>Does disability affect ability to interact socially?</td>
                    <InsertYesOrNoImg bool={SocialSurvey?.DisabilityImpact}/>
                  </tr>
                  <tr>
                    <td>Experienced discrimination because of your disability</td>
                    <InsertYesOrNoImg bool={SocialSurvey?.Discrimination}/>
                  </tr>
                </tbody>
              </Table>
          </div>
      );
  }

  function EducationSurvey() {
      const EducationSurvey = baselineSurvey['EducationSurvey'];
      setSurveyFound(EducationSurvey !== null);
      return(
          <div>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Inquiry</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Goes to school</td>
                    <InsertYesOrNoImg bool={EducationSurvey?.SchoolState}/>
                  </tr>
                  <tr>
                    <td>Current Grade</td>
                    <td>{EducationSurvey?.CurrentGrade ? EducationSurvey.CurrentGrade : "--"}</td>
                  </tr>
                  <tr>
                    <td>Reason for not attending school</td>
                    <td>{EducationSurvey?.NoSchoolReason ? EducationSurvey.NoSchoolReason : "--"}</td>
                  </tr>
                  <tr>
                    <td>Has ever attended school</td>
                    <InsertYesOrNoImg bool={EducationSurvey?.SchoolBefore}/>
                  </tr>
                  <tr>
                    <td>Wants to go to school</td>
                    <InsertYesOrNoImg bool={EducationSurvey?.WantSchool}/>
                  </tr>
                </tbody>
              </Table>
          </div>
      );
  }

  function LivelihoodSurvey() {
      const LivelihoodSurvey = baselineSurvey['LivelihoodSurvey'];
      setSurveyFound(LivelihoodSurvey !== null);
      return(
          <div>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Inquiry</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Currently working</td>
                    <InsertYesOrNoImg bool={LivelihoodSurvey?.WorkStatus}/>
                  </tr>
                  <tr>
                    <td>Work Description</td>
                    <td>{LivelihoodSurvey?.WorkDescription ? LivelihoodSurvey.WorkDescription : "--"}</td>
                  </tr>
                  <tr>
                    <td>Employed or self-employed</td>
                    <td>{LivelihoodSurvey?.EmploymentType ? LivelihoodSurvey.EmploymentType : "--"}</td>
                  </tr>
                  <tr>
                    <td>Does this meet financial needs</td>
                    <InsertYesOrNoImg bool={LivelihoodSurvey?.FinancialNeedsMet}/>
                  </tr>
                  <tr>
                    <td>Does your disability affect ability to work</td>
                    <InsertYesOrNoImg bool={LivelihoodSurvey?.DisabilityImpact}/>
                  </tr>
                  <tr>
                    <td>Want work</td>
                    <InsertYesOrNoImg bool={LivelihoodSurvey?.WorkWanted}/>
                  </tr>
                </tbody>
              </Table>
          </div>
      );
  }

  function NutritionSurvey() {
      const NutritionSurvey = baselineSurvey['NutritionSurvey'];
      setSurveyFound(NutritionSurvey !== null);
      return(
          <div>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Inquiry</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Food security level</td>
                    <td>{NutritionSurvey?.FoodStatus ? NutritionSurvey.FoodStatus : "--"}</td>
                  </tr>
                  <tr>
                    <td>Enough food every month</td>
                    <InsertYesOrNoImg bool={NutritionSurvey?.MonthlyFoodAccess}/>
                  </tr>
                  <tr>
                    <td>If child, nutrition status</td>
                    <td>{NutritionSurvey?.ChildNutritionStatus ? NutritionSurvey.ChildNutritionStatus : "--"}</td>

                  </tr>
                </tbody>
              </Table>
          </div>
      );
  }

  function EmpowermentSurvey() {
      const EmpowermentSurvey = baselineSurvey['EmpowermentSurvey'];
      setSurveyFound(EmpowermentSurvey !== null);
      return(
          <div>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Inquiry</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Is a member of a disability organization</td>
                    <InsertYesOrNoImg bool={EmpowermentSurvey?.DisabilityOrganizationMember}/>
                  </tr>
                  <tr>
                    <td>List of organizations</td>
                    <td>{EmpowermentSurvey?.DisabilityOrganizations ? (EmpowermentSurvey.DisabilityOrganizations.join(', ')) : "--"}</td>
                  </tr>
                  <tr>
                    <td>Aware of rights</td>
                    <InsertYesOrNoImg bool={EmpowermentSurvey?.AwareDisabilityRights}/>
                  </tr>
                  <tr>
                    <td>Feel able to influence people around</td>
                    <InsertYesOrNoImg bool={EmpowermentSurvey?.Influential}/>
                  </tr>
                </tbody>
              </Table>
          </div>
      );
  }

  function ShelterSurvey() {
      const ShelterSurvey = baselineSurvey['ShelterSurvey'];
      setSurveyFound(ShelterSurvey !== null)
      return(
          <div>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Inquiry</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Adequate shelter</td>
                    <InsertYesOrNoImg bool={ShelterSurvey?.ShelterAccess}/>
                  </tr>
                  <tr>
                    <td>Access to essential household items</td>
                    <InsertYesOrNoImg bool={ShelterSurvey?.EssentialsAccess}/>
                  </tr>
                </tbody>
              </Table>
          </div>
      );
  }

  if (!surveyFound)
    return(<div></div>);

  return (
      <div>
          <Row>
              <Col><h4>Baseline Survey</h4></Col>
          </Row>
          <InsertSpecificSurvey/>
      </div>
  );
}

export default BaselineSurvey;