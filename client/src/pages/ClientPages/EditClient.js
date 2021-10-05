import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { UserContext } from '../../components/UserContext';
import { isPattern } from '@formiz/validations';
import { Col, Row, FormText, CardBody, Card } from 'reactstrap';
import CookieChecker from '../../components/CookieChecker';
import AdminSideBar from '../../components/AdminSideBar';

import { MultiStepForm, Step, FieldInput, FieldCheck, FieldTypeahead } from '../../components/MultiStepForm';

function EditClient(props) {
  const [imagePreviewSrc, setImagePreviewSrc] = useState('')
  const [caregiverPresent, setCaregiverPresent] = useState(false)
  const PHONE_NUMBER_REGEX = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/g
  const history = useHistory()
  const context = useContext(UserContext)
  const [isAdmin, setIsAdmin] = useState(false)

  const [ client, setClient ] = useState({})
  const [ photo, setPhoto ] = useState("")

  useEffect(() => {
    if(context.Role === 'Admin') {
        setIsAdmin(true)
    }
  }, [])

  useEffect(() => {

    axios.get('/clients/' + props.match.params.id)
    .then(response => {
        setClient(response.data)
        setPhoto(response.data.Photo)
    })
    .catch(error => {
        console.log(error)
        document.title = "Client not found"
        alert("Client not found")
        history.push("/dashboard")
    })

    document.title="Edit Client"
  }, [])

  function formatSubmitData(data) {
    data['Consent'] = (data['Consent']) ? 'Y' : 'N'
    data['CaregiverState'] = (data['CaregiverState']) ? 'Y' : 'N'
    console.log(data['CaregiverState'])
    data['Photo'] = (imagePreviewSrc) || null
    data['DisabilityType'] = (data['DisabilityType']) ? `${data['DisabilityType']}` : "Don't Know" 

    if (photo.length < 100 && !imagePreviewSrc) {
      data['DeletePhoto'] = "Y"
    }

    const formData = new FormData()
    for (let [key, val] of Object.entries(data)) {
      if (key === 'DisabilityType') {
        val = val.split(',').join(", ")
      }
      formData.append(key, (val != null) ? val : 'N/A')
    }
    return formData
  }

  async function onValidSubmit(data) {
    data = formatSubmitData(data)

    axios.put('/clients/' + props.match.params.id + '/edit', data)
    .then(response => {
      alert("Client edited successful")
      history.push("/client/" + props.match.params.id)
    })
    .catch (error => {
      console.log(error)
      alert("Something went wrong when trying to edit client")
    })
  }

  const formContainerSize = {
    margin: 'auto',
    maxWidth: 600,
  }

  // TODO: Apply changes from new client page feedback to this page

  return (
    <div key={client.ClientId}>
      <CookieChecker></CookieChecker>
      <div className={`${isAdmin ? "main-content" : ""}`}>
        {isAdmin ?
          <AdminSideBar/>
        : ''}
        <div className={`${isAdmin ? "admin-container" : ""}`}>
          <MultiStepForm name='Edit Client' formContainerSize={formContainerSize} onValidSubmit={onValidSubmit}>

            <Step name='General'>
              <Row form>
                <Col xs={6}>
                  <FieldInput name="FirstName" label="First Name" type="text" required="First Name is required" defaultValue={client.FirstName}/>
                </Col>

                <Col xs={6}>
                  <FieldInput name="LastName" label="Last Name" type="text" required="Last Name is required" defaultValue={client.LastName}/>
                </Col>
              </Row>

              <Row form>
                <Col xs={2}>
                  <FieldInput name="Age" label="Age" type="number" min="1" required="Age is required" defaultValue={client.Age}/>
                </Col>

                <Col xs={10}>
                  {(client.Gender === 'Male') ? (
                    <div className='mt-3 pt-3'>
                      <FieldCheck name="Gender" type="radio" label="Male" value="Male" defaultChecked/>
                      <FieldCheck name="Gender" type="radio" label="Female" value="Female" className='ml-4 pl-2'/>
                    </div>
                  ) : (
                    <div className='mt-3 pt-3'>
                      <FieldCheck name="Gender" type="radio" label="Male" value="Male"/>
                      <FieldCheck name="Gender" type="radio" label="Female" value="Female" className='ml-4 pl-2' defaultChecked/>
                  </div>
                  )}
                </Col>

                <Col xs={12}>
                  {(photo.length < 100) ? (
                    <img src={((imagePreviewSrc) && URL.createObjectURL(imagePreviewSrc))} style={{ width: '100%', maxWidth: 150 }}/>
                  ) : (
                    <img src={((imagePreviewSrc) && URL.createObjectURL(imagePreviewSrc)) || `data:image/jpeg;base64,${client.Photo}`} style={{ width: '100%', maxWidth: 150 }}/>
                  )}
                  <FieldInput 
                    name="Photo" 
                    label="Client Picture"
                    type="file"
                    required={photo.length < 100 && "Client photo is required"}
                    onChange={(e) => {
                      if (e.target) {
                        setImagePreviewSrc(e.target.files[0])
                      }
                    }}
                  />
                  <FormText className='mb-2 pb-1'>The picture should include both the client &amp; the caregiver (if available)</FormText>
                </Col>
              </Row>

              <hr/>

              <Row form>

                <Col xs={9} md={10}>
                  <FieldInput name="Location" label="Location" type="select" required="Location is required" defaultValue={client.Location}>
                    <option selected hidden>Choose a location</option>
                    <option>BidiBidi Zone 1</option>
                    <option>BidiBidi Zone 2</option>
                    <option>BidiBidi Zone 3</option>
                    <option>BidiBidi Zone 4</option>
                    <option>BidiBidi Zone 5</option>
                    <option>Palorinya Basecamp</option>
                    <option>Palorinya Zone 1</option>
                    <option>Palorinya Zone 2</option>
                    <option>Palorinya Zone 3</option>
                  </FieldInput>
                </Col>

                <Col xs={3} md={2}>
                  <FieldInput name="VillageNo" label="Village #" type="number" required="Village No. is required" defaultValue={client.VillageNumber}/>
                </Col>

                <Col xs={12}>
                  <FieldInput 
                    name="ContactNo" 
                    label="Contact Number (Optional)" 
                    type="text"
                    placeholder="e.g. 756-126-9380"
                    validations={[
                      {
                        rule: isPattern(PHONE_NUMBER_REGEX),
                        message: 'Invalid contact number format'
                      }
                    ]}
                  />
              </Col>
              </Row>
            </Step>

            <Step name='Health Details'>
              <Row form>
                <Col xs={12}>
                  <h4 className='mb-3'>Disabilities</h4>
                  <FieldTypeahead
                    id="DisabilityType"
                    name="DisabilityType"
                    placeholder="Add a disability type... (e.g. Polio)"
                    // TODO: Fix bug where the required doesn't work properly with defaultValue
                    required={"At least one option must be chosen"}
                    defaultValue={client.DisabilityType}
                    options={[
                      'Amputee', 'Polio', 
                      'Spinal Cord Injury', 'Cerebral Palsy', 
                      'Spina Bifida', 'Hydrocephalus', 
                      'Visual Impairment','Hearing Impairment', 
                      'Don\'t Know', 'Other'
                    ]}
                    onChange={(values) => {
                      if (values[values.length-1] === 'Don\'t Know' && values.length >= 1) return ['Don\'t Know']
                      else if (values[values.length-2] === 'Don\'t Know' && values.length >= 1) return values.slice(1)
      
                      if (values[values.length-1] === 'Other' && values.length >= 1) return ['Other']
                      else if (values[values.length-2] === 'Other' && values.length >= 1) return values.slice(1)
                      
                      return values
                    }}
                    multiple
                  />

                  <hr/>
                </Col>

                <Col xs={12}>
                  <h4>Wellbeing Check</h4>
                  <FormText>Rate the client's wellbeing following <a href='https://www.hopehealthaction.org/' target='blank'>HHA's wellbeing guidelines</a>.</FormText> 

                  <Card className='mt-4'>
                    <CardBody>
                      <h5>Health</h5>

                      <FieldInput name="HealthStatus" label="Current Rating" type="select" required="Rating is required" defaultValue={client.HealthStatus}>
                        <option selected hidden>Choose a rating</option>
                        <option value='Critical Risk'>4 — Critical Risk</option>
                        <option value='High Risk'>3 — High Risk</option>
                        <option value='Medium Risk'>2 — Medium Risk</option>
                        <option value='Low Risk'>1 — Low Risk</option>
                      </FieldInput>

                      <FieldInput name="HealthGoal" label="Goals to achieve" type="textarea" defaultValue={client.HealthGoal}/>
                      <FieldInput name="HealthDesc" label="Required resources for area" type="textarea" defaultValue={client.HealthDesc}/>
                    </CardBody>
                  </Card>

                  <Card className='mt-4'>
                    <CardBody>
                      <h5>Social</h5>

                      <FieldInput name="SocialStatus" label="Current Rating" type="select" required="Rating is required" defaultValue={client.SocialStatus}>
                        <option selected hidden>Choose a rating</option>
                        <option value='Critical Risk'>4 — Critical Risk</option>
                        <option value='High Risk'>3 — High Risk</option>
                        <option value='Medium Risk'>2 — Medium Risk</option>
                        <option value='Low Risk'>1 — Low Risk</option>
                      </FieldInput>

                      <FieldInput name="SocialGoal" label="Goals to achieve" type="textarea" defaultValue={client.SocialGoal}/>
                      <FieldInput name="SocialDesc" label="Required resources for area" type="textarea" defaultValue={client.SocialDesc}/>
                    </CardBody>
                  </Card>

                  <Card className='mt-4'>
                    <CardBody>
                      <h5>Education</h5>

                      <FieldInput name="EducationStatus" label="Current Rating" type="select" required="Rating is required" defaultValue={client.EducationStatus}>
                        <option selected hidden>Choose a rating</option>
                        <option value='Critical Risk'>4 — Critical Risk</option>
                        <option value='High Risk'>3 — High Risk</option>
                        <option value='Medium Risk'>2 — Medium Risk</option>
                        <option value='Low Risk'>1 — Low Risk</option>
                      </FieldInput>

                      <FieldInput name="EducationGoal" label="Goals to achieve" type="textarea" defaultValue={client.EducationGoal}/>
                      <FieldInput name="EducationDesc" label="Required resources for area" type="textarea" defaultValue={client.EducationDesc}/>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Step>
            
            <Step name='Miscellaneous'>
              <Row form>
                <Col xs={12}>
                  <h4>Caregiver Details</h4>
                  <FieldCheck
                    name="CaregiverState"
                    type="checkbox"
                    label="Caregiver present?"
                    defaultChecked={client.CaregiverState === "Y"}
                    onChange={() => setCaregiverPresent(!caregiverPresent)}
                  />

                  {(caregiverPresent) ? (
                    <FieldInput 
                      name="CaregiverContactNo" 
                      label="Caregiver Contact Number" 
                      type="text"
                      placeholder="e.g. 756-126-9380"
                      required={(caregiverPresent) && 'Contact No. is required'}
                      defaultValue={client.CaregiverContactNo}
                      validations={[
                        {
                          rule: isPattern(PHONE_NUMBER_REGEX),
                          message: 'Invalid contact number format'
                        }
                      ]}
                    />
                  ) : ''}

                  <hr/>
                </Col>

                <Col xs={12}>
                  <h4>Interviews</h4>
                  <FormText className='mb-2 pb-1'>Consent will allow HHA to conduct interviews for research and educational purposes.</FormText>
                  <FieldCheck
                    name="Consent"
                    type="checkbox"
                    label="Client consents to Interview"
                    defaultChecked={client.Consent === "Y"}
                  />
                </Col>
              </Row>
            </Step>
          </MultiStepForm>
        </div>
      </div>
    </div>
  )
}

export default EditClient;
