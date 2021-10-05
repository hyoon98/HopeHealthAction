import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { isPattern } from '@formiz/validations';
import { Col, Row, FormText, CardBody, Card, FormGroup, Label } from 'reactstrap';
import DatePicker from 'reactstrap-date-picker';
import {getGPSLocation} from '../Helpers';
import CookieChecker from '../../components/CookieChecker';
import { MultiStepForm, Step, FieldInput, FieldCheck, FieldTypeahead } from '../../components/MultiStepForm';
import MapWithMarker from '../../components/MapWithMarker';
import { UserContext } from '../../components/UserContext';


const formContainerSize = {
  margin: 'auto',
  maxWidth: 600,
}

function NewClientSignup() {
  const [imagePreviewSrc, setImagePreviewSrc] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [caregiverPresent, setCaregiverPresent] = useState(false)
  const [clientDate, setClientDate] = useState((new Date()).toISOString())
  const [GPSLocation, setGPSLocation] = useState();
  const phoneNumberRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/g
  const context = useContext(UserContext);
  const history = useHistory()

  useEffect(() => {
    getGPSLocation(setGPSLocation);
    document.title="New Client Registration"
  }, [])

  function formatSubmitData(data) {
    data['Consent'] = (data['Consent']) ? 'Y' : 'N'
    data['CaregiverState'] = (data['CaregiverState']) ? 'Y' : 'N'
    data['Photo'] = (imagePreviewSrc) || null
    data['DisabilityType'] = (data['DisabilityType']) ? `${data['DisabilityType']}` : "Don't Know" 
    data['DateCreated'] = clientDate
    data['Gender'] = (data['Gender'] || 'Male')
    data['WorkerId'] = context.WorkerId

    if (GPSLocation)
      data['GPSLocation'] = GPSLocation

    const formData = new FormData()
    for (let [key, val] of Object.entries(data)) {
      if (key === 'DisabilityType') {
        val = val.split(',').join(", ")
      }
      else if (key === 'GPSLocation') {
        val = JSON.stringify(val);
      }
      formData.append(key, (val != null) ? val : 'N/A')
    }

    return formData
  }

  async function onValidSubmit(data) {
    data = formatSubmitData(data)

    try {
      await axios.post('/clients/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      alert('New client successfully added')
      history.push('/dashboard') 
      
    } catch(err) {
      console.error(err.message)
    }
  }

  return (
    <MultiStepForm name='New Client Registration' formContainerSize={formContainerSize} onValidSubmit={onValidSubmit}>
      <CookieChecker></CookieChecker>
      {/* 1. General Details */}
      <Step name='General'>
        <Row form>
          <Col xs={12}>
            <h4>Interviews</h4>
            <FormText className='mb-2 pb-1'>Consent will allow HHA to conduct interviews for research and educational purposes. It will be required for future visits and referals.</FormText>
            <FieldCheck
              name="Consent"
              type="checkbox"
              label="Client consents to Interview"
              required="Client's consent is required"
              onChange={() => setConsentGiven(!consentGiven)}
            />

            <hr class='invisible'/>
          </Col>
        </Row>

        <div class={(consentGiven) ? 'fade-to-out' : 'fade-to-in'}>
          <Row form>
            <Col xs={12}>
              <h4>General Details</h4>
              <FormText className='mb-2 pb-1'>Basic Information about the new client.</FormText>
            </Col>

            <Col xs={6}>
              <FieldInput name="FirstName" label="First Name" type="text" required="First Name is required"/>
            </Col>

            <Col xs={6}>
              <FieldInput name="LastName" label="Last Name" type="text" required="Last Name is required"/>
            </Col>
          </Row>

          <Row form>
            <Col xs={2}>
              <FieldInput name="Age" label="Age" type="number" min="1" required="Age is required"/>
            </Col>

            <Col xs={10}>
              <div className='mt-3 pt-3'>
                <FieldCheck name="Gender" type="radio" label="Male" value="Male" defaultChecked/>
                <FieldCheck name="Gender" type="radio" label="Female" value="Female" className='ml-4 pl-2'/>
              </div>
            </Col>

            <Col xs={12}>
              <img src={(imagePreviewSrc) && URL.createObjectURL(imagePreviewSrc)} style={{ width: '100%', maxWidth: 150 }}/>
              <FieldInput 
                name="Photo" 
                label="Client Picture"
                required="Client photo is required"
                type="file"
                accept="image/*" 
                onChange={(e) => {
                  if (e.target) setImagePreviewSrc(e.target.files[0])
                }}
              />
              <FormText className='mb-2 pb-1'>The picture should include both the client &amp; the caregiver (if available)</FormText>
            </Col>
          </Row>

          <hr/>

          <Row form>
            <Col xs={12}>
              <FormGroup>
                <Label>New Client On</Label>
                <DatePicker
                  dateFormat='DD-MM-YYYY'
                  showClearButton={false}
                  value={clientDate}
                  onChange={(v) => setClientDate(v)}
                />
              </FormGroup>
            </Col>

            {(GPSLocation) ? (
              <Col xs={12}>
                <Label>GPS Location</Label>
                <MapWithMarker
                  loadingElement={<div style={{ height: '75%' }} />}
                  containerElement={<div style={{ height: '400px', width: '380px' }} />}
                  mapElement={<div style={{ height: '95%' }} />}
                  location={GPSLocation}
                />
            </Col>
            ) : ("")}

            <Col xs={9} md={10}>
              <FieldInput name="Location" label="Location" type="select" required="Location is required">
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
              <FieldInput name="VillageNumber" label="Village #" type="number" required="Village No. is required"/>
            </Col>

            <Col xs={12}>
              <FieldInput 
                name="ContactNo" 
                label="Contact Number (Optional)" 
                type="text"
                placeholder="e.g. 756-126-9380"
                validations={[
                  {
                    rule: isPattern(phoneNumberRegex),
                    message: 'Invalid contact number format'
                  }
                ]}
              />
            </Col>
          </Row>
        </div>
      </Step>

      {/* 2. Health Details */}
      <Step name='Health Details'>
        <Row form>
          <Col xs={12}>
            <h4 className='mb-3'>Disabilities</h4>
            <FieldTypeahead
              id="DisabilityType"
              name="DisabilityType"
              placeholder="Add a disability type... (e.g. Polio)"
              required="One option must be chosen"
              options={[
                'Amputee', 'Polio', 
                'Spinal Cord Injury', 'Cerebral Palsy', 
                'Spina Bifida', 'Hydrocephalus', 
                'Visual Impairment','Hearing Impairment', 
                'Don\'t Know', 'Other'
              ]}
              onChange={(v) => {
                // hacky way of removing selections if user chooses
                // "Don't Know" or "Other" options but it works 👍
                if (v[v.length-1] === 'Don\'t Know' && v.length >= 1) return ['Don\'t Know']
                else if (v[v.length-2] === 'Don\'t Know' && v.length >= 1) return v.slice(1)

                if (v[v.length-1] === 'Other' && v.length >= 1) return ['Other']
                else if (v[v.length-2] === 'Other' && v.length >= 1) return v.slice(1)
                return v
              }}
              multiple
            />

            <hr/>
          </Col>

          <Col xs={12}>
            <h4>Wellbeing Check</h4>
            <FormText>Rate the client's wellbeing following <a href='https://www.hopehealthaction.org/' target='blank'>HHA's wellbeing guidelines</a>.</FormText> 

            {['Health', 'Education', 'Social'].map((area, i) => (
              <Card className='mt-4' key={`area-${i}`}>
                <CardBody>
                  <h5>{area}</h5>

                  <FieldInput name={`${area}Status`} label="Current Rating" type="select" required="Rating is required">
                    <option selected hidden>Choose a rating</option>
                    <option value='Critical Risk'>4 — Critical Risk</option>
                    <option value='High Risk'>3 — High Risk</option>
                    <option value='Medium Risk'>2 — Medium Risk</option>
                    <option value='Low Risk'>1 — Low Risk</option>
                  </FieldInput>

                  <FieldInput name={`${area}Goal`} label="Goals to achieve" type="textarea"/>
                  <FieldInput name={`${area}Desc`} label="Required resources for area" type="textarea"/>
                </CardBody>
              </Card>
            ))}
          </Col>
        </Row>
      </Step>

      {/* 3. Caregiver Details */}
      <Step name='Caregiver'>
        <Row form>
          <Col xs={12}>
            <h4>Caregiver Details</h4>
            <FieldCheck
              name="CaregiverState"
              type="checkbox"
              label="Caregiver present?"
              onChange={() => setCaregiverPresent(!caregiverPresent)}
            />

            {(caregiverPresent) ? (
              <>
                <FieldInput
                  name="CaregiverName"
                  label="Caregiver Name"
                  required={(caregiverPresent) && 'Caregiver\'s name is required' }
                />

                <FieldInput 
                  name="CaregiverContactNo" 
                  label="Caregiver Contact Number" 
                  type="text"
                  placeholder="e.g. 756-126-9380"
                  required={(caregiverPresent) && 'Contact No. is required'}
                  validations={[
                    {
                      rule: isPattern(phoneNumberRegex),
                      message: 'Invalid contact number format'
                    }
                  ]}
                />
              </>
            ) : ''}
          </Col>
        </Row>
      </Step>
    </MultiStepForm>
  )
}

export default NewClientSignup;