import React, {useContext, useEffect, useState} from 'react';
import { Container, FormGroup, Col, Row, Label, Input, FormText } from 'reactstrap';
import { MultiStepForm, Step, FieldInput, FieldCheck, FieldTypeahead } from "../../components/MultiStepForm";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import NotFoundPage from '../404';
import CookieChecker from '../../components/CookieChecker';
import { UserContext } from '../../components/UserContext';

function NewReferral(props) {

    const context = useContext(UserContext);
    const history = useHistory();
    
    const [ worker, setWorker ] = useState({});
    const [ workerInfoFound, setWorkerInfoFound ] = useState(false);

    const [ client, setClient ] = useState({});
    const [ clientFound, setClientFound ] = useState(false);
    const [ clients, setClients ] = useState([]);
    const [ clientProvided, setClientProvided ] = useState(false);
    const [ otherSelected, setOtherSelected ] = useState(false);

    const [ wheelchairService, setWheelchairService ] = useState(false);
    const [ physioService, setPhysioService ] = useState(false);
    const [ prostheticService , setProstheticService ] = useState(false);
    const [ orthoticService , setOrthoticService ] = useState(false);

    const [ wheelchairImgPreview, setWheelchairImgPreview ] = useState('');
    const [ hasWheelchair, setHasWheelchair ] = useState(true);

    const [ physioImgPreview, setPhysioImgPreview ] = useState('');
    const [ otherCondition, setOtherCondition ] = useState(false);

    const [ prostheticImgPreview, setProstheticImgPreview ] = useState('');
    const [ orthoticImgPreview, setOrthoticImgPreview ] = useState('');

    function prepareData(data) {
        let newData = {};
        
        if (clientProvided) {
            newData['ClientId'] = props.match.params.id;
        }
        else {
            newData['ClientId'] = data.client[0].value;
        }

        newData['ReferTo'] = data['referTo'];
        newData['Status'] = "Made";
        newData['Date'] = data['date'];
        newData['WorkerId'] = context.WorkerId;
        
        let services = []
        const formData = new FormData()

        if (wheelchairService) {
            let wheelchairForm = {};

            formData.append('wheelchairPhoto', wheelchairImgPreview)
            wheelchairForm['ClientProficiency'] = data['wheelchairProficiency'];
            wheelchairForm['ClientHipWidth'] = data['hipWidth'];
            wheelchairForm['WheelchairExist'] = (data['hasWheelchair'] === "Yes") ? "Y" : "N";
            wheelchairForm['WheelchairRepairable'] = (data['wheelchairRepairable'] === "Yes") ? "Y" : "N";

            services.push("Wheelchair");
            formData.append('WheelchairService', JSON.stringify(wheelchairForm))
        }

        if (physioService) {
            let physioForm = {};

            formData.append('physioPhoto', physioImgPreview)
            physioForm['ClientCondition'] = data['clientCondition'];
            physioForm['OtherClientCondition'] = data['otherCondition'];

            services.push("Physiotherapy");
            formData.append('PhysiotherapyService', JSON.stringify(physioForm))
        }

        if (prostheticService) {
            let prostheticForm = {};

            formData.append('prostheticPhoto', (prostheticImgPreview) || null)
            prostheticForm['InjuryPosition'] = data['prostheticInjuryPosition'];

            services.push("Prosthetic");
            formData.append('ProstheticService', JSON.stringify(prostheticForm))
        }

        if (orthoticService) {
            let orthoticForm = {};

            formData.append('orthoticPhoto', (orthoticImgPreview) || null)
            orthoticForm['InjuryPosition'] = data['orthoticInjuryPosition'];

            services.push("Orthotic");
            formData.append('OrthoticService', JSON.stringify(orthoticForm))
        }

        if (otherSelected) {
            services.push("Other");
        }

        newData['OtherServices'] = data['otherServiceDesc'];

        for (let [key, val] of Object.entries(newData)) {
            formData.append(key, val)
        }

        for(let i = 0; i < services.length; i++){
            formData.append('ServiceRequired', services[i])
        }      
        
        return formData
    }

    function onValidSubmit(data) {
        data = prepareData(data);

        axios.post('/referrals/add', data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        .then(() => {
            alert("Referral was added successfully.");
            // TODO: Should redirect to referral page when that is implemented
            history.push("/dashboard");
        })
        .catch((error) => {
            alert("Something went wrong when trying to add referral.");
            console.log(error);
        })
    }

    useEffect(() => {

        axios.get('/users/worker/' + context.WorkerId)
        .then(response => {
          setWorker(response.data[0].Worker);
          setWorkerInfoFound(true);
        })
        .catch(error => {
          console.log(error);
        })

        if (typeof props.match.params.id !== 'undefined') {
            axios.get('/clients/' + props.match.params.id)
            .then(response => {
                setClient(response.data);
                setClientFound(true);
                setClientProvided(true);
            })
            .catch(error => {
                console.log(error);
                document.title = "Client not found";
                alert("Client not found");
                history.push('/dashboard')
            })
        }
        else {
            setClientProvided(false);
            axios.get('/clients')
            .then(response => {
                const clientArr = [];
                // Reference: https://stackoverflow.com/a/57008713
                // FieldTypeahead options must be an array
                Object.keys(response.data).forEach(key => clientArr.push({value: response.data[key].ClientId, label: response.data[key].FirstName + ' ' + response.data[key].LastName}));
                setClients(clientArr);
            })
            .catch(error => {
                console.log(error);
                alert("Something went wrong")
                history.push('/dashboard')
            })
        }
    
        document.title="New Referral";
    }, [])

    if (!clientFound && clientProvided) {
        return (
            <div>
                <NotFoundPage/>
            </div>
        )
    }    
    
    return (
        <Container>
            <CookieChecker></CookieChecker>
            {(clientProvided) ? (
                <Row>
                    <Col className="font-weight-bold" style={{fontSize: "30px"}}>
                        Client: {client.FirstName + ' ' + client.LastName}
                    </Col>
                </Row>
            ) : ("")}

            <MultiStepForm name="New Referral" onValidSubmit={onValidSubmit}>
                <Step name="General Info">

                    <Row form>
                        <Col>
                            <FormGroup>
                            {(clientProvided) ? (
                                <FieldInput label="Client" name="client" disabled
                                defaultValue={client.FirstName + ' ' + client.LastName}/>
                            ) : (
                                <div>
                                    <Label>Client</Label>
                                    <FieldTypeahead
                                        name="client"
                                        required="Client is required"
                                        options={clients}/>
                                </div>
                            )}
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row form>
                        <Col>
                            <FormGroup>
                            {(workerInfoFound) ? (
                                <FieldInput placeholder="Autofill CBR worker Name" name="worker" label="CBR Worker"
                                 defaultValue={worker.FirstName + ' ' + worker.LastName} disabled/>
                            ): ""}
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row form>
                        <Col>
                            <FormGroup>
                                <FieldInput type="date" name="date" label="Date:" required="Date required"
                                 defaultValue={(new Date()).toLocaleDateString('en-CA')}/>
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Row>
                            <Col>
                                <Label>
                                    Service required (Select all that apply)
                                </Label>
                            </Col>
                        </Row>
                    
                        <Row>
                            <Col>
                                <Label check style={{paddingLeft: "21px", paddingRight: "20px"}}>
                                    <Input type="checkbox" name="wheelCheckBox" onChange={() => setWheelchairService(!wheelchairService)}/>
                                    Wheelchair
                                </Label>
                                <Label check style={{paddingLeft: "21px", paddingRight: "20px"}}>
                                    <Input type="checkbox" name="physioCheckBox" onChange={() => setPhysioService(!physioService)}/>
                                    Physiotheraphy
                                </Label>
                                <Label check style={{paddingLeft: "21px", paddingRight: "20px"}}>
                                    <Input type="checkbox" name="prostheticCheckBox" onChange={() => setProstheticService(!prostheticService)}/>
                                    Prosthetic
                                </Label>
                                <Label check style={{paddingLeft: "21px", paddingRight: "20px"}}>
                                    <Input type="checkbox" name="orthoticCheckBox" onChange={() => setOrthoticService(!orthoticService)}/>
                                    Orthotic
                                </Label>
                                <Label check style={{paddingLeft: "21px", paddingRight: "20px"}}>
                                    <Input type="checkbox" name="orthoticCheckBox" onChange={() => setOtherSelected(!otherSelected)}/>
                                    Other
                                </Label>
                            </Col>
                        </Row>
                    </FormGroup>

                    {(otherSelected) ? (
                        <Row form>
                            <Col>
                                <FormGroup>
                                    <FieldInput type="textarea" placeholder="Please describe" name="otherServiceDesc" label="Other Service"
                                     required="Other service description is required"/>
                                </FormGroup>
                            </Col>
                        </Row>
                    ) : ""}

                    <Row form>
                        <Col>
                            <FormGroup>
                                <FieldInput type="select" placeholder="Center Services" name="referTo" label="Refer to" required="Center Services is required">
                                    <option selected hidden>Make a selection</option>
                                    <option>Disability Center</option>
                                    <option>Mobile Clinic</option>
                                </FieldInput>
                            </FormGroup>
                        </Col>
                    </Row>

                </Step>

                <Step name="Wheelchair Service" isEnabled={wheelchairService}>

                    <Row form>
                        <Col xs={12}>
                            <img src={(wheelchairImgPreview) && URL.createObjectURL(wheelchairImgPreview)} style={{ width: '100%', maxWidth: 150 }}/>
                            <FieldInput 
                            name="wheelchairPhoto" 
                            label="Client photo and any assistive devices"
                            required="Client photo is required"
                            type="file"
                            onChange={(e) => {
                                if (e.target) {
                                setWheelchairImgPreview(e.target.files[0])
                                }
                            }}
                            />
                            <FormText className='mb-2 pb-1'>The picture should include both the client &amp; and any existing assistive devices (if any).</FormText>
                        </Col>
                    </Row>

                    <Row form>
                        <Col>
                            <FormGroup>
                                <FieldInput type="select" name="wheelchairProficiency" label="Client proficiency" required="Client proficiency is required">
                                    <option selected hidden>What is the client's proficiency with a wheelchair?</option>
                                    <option>Basic</option>
                                    <option>Intermediate</option>
                                </FieldInput>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row form>
                        <Col>
                            <FormGroup>
                                <FieldInput type="number" name="hipWidth" label="Hip Width in Inches" min="1" required="Hip width is required"/>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Label>
                                Does the client have a wheelchair?
                            </Label>
                        </Col>
                    </Row>

                    <Row form>
                        <Col>
                            <FormGroup>
                                <FieldCheck name="hasWheelchair" type="radio" label="Yes" value="Yes" defaultChecked
                                 onChange={() => setHasWheelchair(true)}/>
                                <FieldCheck name="hasWheelchair" type="radio" label="No" value="No" className='ml-4 pl-2'
                                 onChange={() => setHasWheelchair(false)}/>
                            </FormGroup>
                        </Col>
                    </Row>

                    {(hasWheelchair) ? (
                        <div>
                            <Row>
                                <Col>
                                    <Label>
                                        Can the wheelchair be repaired?
                                    </Label>
                                </Col>
                            </Row>

                            <Row form>
                                <Col>
                                    <FormGroup>
                                        <FieldCheck name="wheelchairRepairable" type="radio" label="Yes" value="Yes" defaultChecked/>
                                        <FieldCheck name="wheelchairRepairable" type="radio" label="No" value="No" className='ml-4 pl-2'/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                    ) : ("")}
                </Step>

                <Step name="Physiotherapy Service" isEnabled={physioService}>
                    <Row form>
                        <Col xs={12}>
                            <img src={(physioImgPreview) && URL.createObjectURL(physioImgPreview)} style={{ width: '100%', maxWidth: 150 }}/>
                            <FieldInput 
                            name="physioPhoto" 
                            label="Client Photo"
                            required="Client photo is required"
                            type="file"
                            onChange={(e) => {
                                if (e.target) {
                                setPhysioImgPreview(e.target.files[0])
                                }
                            }}
                            />
                        </Col>
                    </Row>

                    <Row form>
                        <Col xs={12}>
                            <Label>Condition</Label>
                            <FieldTypeahead
                            id="clientCondition"
                            name="clientCondition"
                            placeholder="Select a condition"
                            required="At least one option must be chosen"
                            options={[
                                'Amputee', 'Polio', 
                                'Spinal Cord Injury', 'Cerebral Palsy', 
                                'Spina Bifida', 'Hydrocephalus', 
                                'Visual Impairment','Hearing Impairment', 
                                'Other'
                            ]}
                            onChange={(v) => {
                                setOtherCondition(v.includes('Other'))

                                if (v[v.length-1] === 'Other' && v.length >= 1) return ['Other']
                                else if (v[v.length-2] === 'Other' && v.length >= 1) return v.slice(1)
                                return v
                            }}
                            multiple
                            />
                        </Col>
                    </Row>

                    {(otherCondition) ? (
                        <Row form>
                            <Col>
                                <FieldInput name="otherCondition" label="Other Condition" placeholder="Please describe the other condition"
                                 required="Description is required"/>
                            </Col>
                        </Row>
                    ) : ("")}
                </Step>

                <Step name="Prosthetic Service" isEnabled={prostheticService}>
                    <Row form>
                        <Col xs={12}>
                            <img src={(prostheticImgPreview) && URL.createObjectURL(prostheticImgPreview)} style={{ width: '100%', maxWidth: 150 }}/>
                            <FieldInput 
                            name="prostheticPhoto" 
                            label="Photo (Optional)"
                            type="file"
                            onChange={(e) => {
                                if (e.target) {
                                setProstheticImgPreview(e.target.files[0])
                                }
                            }}
                            />
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                            <FieldInput type="select" name="prostheticInjuryPosition" label="Where is the injury?" required="Selection is required">
                                <option selected hidden>Where is the injury?</option>
                                <option>Below knee</option>
                                <option>Above knee</option>
                            </FieldInput>
                        </Col>
                    </Row>
                </Step>

                <Step name="Orthotic Service" isEnabled={orthoticService}>
                    <Row form>
                        <Col xs={12}>
                            <img src={(orthoticImgPreview) && URL.createObjectURL(orthoticImgPreview)} style={{ width: '100%', maxWidth: 150 }}/>
                            <FieldInput 
                            name="orthoticPhoto" 
                            label="Photo (Optional)"
                            type="file"
                            onChange={(e) => {
                                if (e.target) {
                                setOrthoticImgPreview(e.target.files[0])
                                }
                            }}
                            />
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                            <FieldInput type="select" name="orthoticInjuryPosition" label="Where is the injury?" required="Selection is required">
                                <option selected hidden>Where is the injury?</option>
                                <option>Below elbow</option>
                                <option>Above elbow</option>
                            </FieldInput>
                        </Col>
                    </Row>
                </Step>
            </MultiStepForm>
        </Container>
    )
}

export default NewReferral;