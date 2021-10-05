import React, { useState, useEffect, useContext } from "react";
import { Collapse, Container, Button, Form, FormGroup, Input, Label, Table } from 'reactstrap';
import axios from 'axios';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';
import { Formiz, useForm } from '@formiz/core';
import moment from 'moment';

import AdminSideBar from '../../components/AdminSideBar';
import CookieChecker from '../../components/CookieChecker';
import { FieldInput, FieldTypeahead } from "../../components/MultiStepForm";
import { UserContext } from '../../components/UserContext';
import '../../css/AdminAlerts.css';


function AdminAlerts() {

    const [ workers, setWorkers ] = useState([]);

    const [ alerts, setAlerts ] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [alertAllWorkers, setAlertAllWorkers] = useState(true);

    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentPageAlerts, setCurrentPageAlerts] = useState([]);
    const alertsPerPage = 15;

    const [isCurrentAuthor, setIsCurrentAuthor] = useState(true);

    const context = useContext(UserContext);

    useEffect(() => {
        axios.get('/workers')
            .then((response) => {
                const workerArr = [];
                // Reference: https://stackoverflow.com/a/57008713
                // FieldTypeahead options must be an array
                Object.keys(response.data).forEach(key =>
                    workerArr.push({value: response.data[key].WorkerId,
                                    label: response.data[key].FirstName + ' ' + response.data[key].LastName
                                   }));
                setWorkers(workerArr);
            })
            .catch((error) => {
                console.log(error);
            })

        axios.get('/alerts')
            .then((response) => {
                setAlerts(response.data);
                setCurrentPageAlerts(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    function deleteAlert(AlertId) {

        var confirmDelete = window.confirm("Are you sure you would like to delete this message?");
        if (!confirmDelete) {
            return;
        }

        axios.delete('/alerts/' + AlertId + '/delete')
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
                alert("Something went wrong when trying to delete the alert");
            });
    }

    function handlePageClick(event) {
        setOffset(event.selected * alertsPerPage);
    }

    function setAlertPages(relevantAlerts) {
        setPageCount(Math.ceil(relevantAlerts.length / alertsPerPage));
        let currentPage = relevantAlerts.slice(offset, offset + alertsPerPage);
        setCurrentPageAlerts(currentPage);
    }

    function filterList(){
        let relevantAlerts = [];

        alerts.forEach((alert) => {
         if (!isCurrentAuthor || (isCurrentAuthor && alert.AuthorUsername === context.Username))
             relevantAlerts.push(alert);
         })

        setAlertPages(relevantAlerts);
    }

    function openModal() {
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
    }

    function cancelAlert() {
        var confirmCancel = window.confirm("Are you sure you would like to abort message?");
        if (confirmCancel) {
            closeModal();
        }
    }

    function sendAlert(data) {
        const sendData = formatData(data);

        axios.post('/alerts/add', sendData)
        .then(() => {
            closeModal();
            alert("Alert sent");
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
            alert("Something went wrong when trying to send alert");
        });
    }

    function formatData(data) {
        let specificWorkersArr = [];
        if (data.SpecificWorkers) {
            specificWorkersArr = data.SpecificWorkers.map(function (worker) {
                return worker.value;
            });
        }

        return ({
            'Title': data.Title,
            'Message': data.Message,
            'AuthorUsername': context.Username,
            'SpecificWorkers': specificWorkersArr,
            'ForAllWorkers': alertAllWorkers
        });
    }

    let formState = useForm();
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

      function changedCheckbox() {
        setIsCurrentAuthor(!isCurrentAuthor);
        filterList();
      }

    function PrintSpecificWorkerNames(props) {
        if (!props.specificWorkerIdsArr || props.specificWorkerIdsArr.length <= 0) {
            return (<td>All</td>);
        }
        const workerNamesArr = [];
        workers.forEach((worker) => {
             if (props.specificWorkerIdsArr.includes(worker.value))
                 workerNamesArr.push(worker.label);
             })
        return (<td>{(workerNamesArr).join(', ')}</td>)
    }

    return (
        <>
        <CookieChecker/>
        <div className="main-content">
            <AdminSideBar/>
            <div className='admin-container'>
                <h1>Alerts</h1>
                <Button className="button" onClick={openModal}>Create message</Button>
                <br/>

                <Form>
                    <FormGroup>
                         <Label check className="checkbox">
                            <Input type="checkbox" defaultChecked={false} onChange={changedCheckbox}/>
                            Show current admin alerts only
                         </Label>
                    </FormGroup>
                </Form>

                <Table responsive className="alerts-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Author</th>
                            <th>Recipients</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageAlerts.map(({AlertId, Title, Message, Date, AuthorUsername, SpecificWorkers}) => (
                            <tr>
                                <td>{Title}</td>
                                <td>{Message}</td>
                                <td>{moment(Date).format('DD-MM-YYYY HH:mm')}</td>
                                <td>{AuthorUsername}</td>
                                <PrintSpecificWorkerNames specificWorkerIdsArr={SpecificWorkers}/>
                                <td>
                                    <Button onClick={() => deleteAlert(AlertId)} color="danger">Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <ReactPaginate previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={2}
                            onPageChange={handlePageClick}
                            forcePage={offset / alertsPerPage}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'pagination_active'}/>

                <Modal
                 isOpen={modalOpen}
                 onRequestClose={closeModal}
                 style={customStyles}
                 shouldCloseOnOverlayClick={false}>
                    <Container>
                        <Formiz connect={formState} onValidSubmit={sendAlert}>
                            <form onSubmit={formState.submit}>
                                <h4>Compose message</h4>
                                <FieldInput label="Title" type="text" name="Title" placeholder="Title" required="Title is required"/>
                                <FieldInput label="Message Body" type="textarea" name="Message" placeholder="Enter message body here..."/>
                                 <FormGroup>
                                      <Label check style={{paddingLeft: "21px", paddingRight: "20px"}}>
                                        <Input type="checkbox" name="ForAllWorkers" defaultChecked={alertAllWorkers}
                                            onChange={() => setAlertAllWorkers(!alertAllWorkers)}/>
                                        Send to all workers
                                      </Label>
                                    <Collapse isOpen={!alertAllWorkers}>
                                    <Container>
                                          {(!alertAllWorkers) ? (
                                              <FieldTypeahead
                                                  id="worker"
                                                  name="SpecificWorkers"
                                                  placeholder="Add worker"
                                                  required="Worker is required"
                                                  options={workers}
                                                  multiple/>
                                          ) : ''}
                                    </Container>
                                    </Collapse>
                                  </FormGroup>
                                <Button type="submit">Submit</Button>
                                <Button onClick={cancelAlert} style={{float: 'right'}}>Cancel</Button>
                            </form>
                        </Formiz>
                    </Container>
                </Modal>
            </div>
        </div>
        </>
    );

}

export default AdminAlerts;