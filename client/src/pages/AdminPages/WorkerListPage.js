import React, {useEffect, useState} from 'react';
import {Row, Col, Button, Table, Form, FormGroup, Input, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import AdminSideBar from '../../components/AdminSideBar';
import CookieChecker from '../../components/CookieChecker';
import '../../css/WorkerList.css';
import axios from 'axios';

function WorkerListPage(props) {
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentPageWorkers, setCurrentPageWorkers] = useState([]);
    const [workers, setWorkers] = useState([]);

    const [searchName, setSearchName] = useState('')
    const [searchLocation, setSearchLocation] = useState('');

    const workersPerPage = 15;

    useEffect(() => {
        axios.get('/workers')
            .then(res => {
                setWorkers(res.data);
                setCurrentPageWorkers(res.data);
            })
            .catch(err => console.log(err))
        document.title = 'Workers List'
    }, [])

    function handlePageClick(event) {
        setOffset(event.selected * workersPerPage);
    }

    function setWorkerPages(relevantWorkers) {
        setPageCount(Math.ceil(relevantWorkers.length / workersPerPage));
        let currentPage = relevantWorkers.slice(offset, offset + workersPerPage);
        setCurrentPageWorkers(currentPage);
    }

    function filterList(event) {
        event.preventDefault();
        let relevantWorkers = [];

        workers.forEach((worker) => {
            if ((worker.Location === searchLocation || searchLocation === '') 
                && (worker.FirstName + ' ' + worker.LastName).toLowerCase().includes(searchName.toLowerCase()))
                relevantWorkers.push(worker);
        })

        setWorkerPages(relevantWorkers);
    }

    function resetFilters() {
        setSearchName('');
        setSearchLocation('');
        setCurrentPageWorkers(workers);
    }

    async function deleteAccount(WorkerId) {
        axios.delete('/users/delete', { data: { WorkerId: WorkerId } })
        .then(() => {
            alert('Worker is deleted');
            window.location.reload();
        })
        .catch(err => {
            console.log(err)
            alert('An error occurred, the worker is not able to be deleted');
        })
    }

    return (
        <>
            <CookieChecker/>
            <div className='main-content'>
                <AdminSideBar/>

                <div className='admin-container'>
                    <h1>Worker List</h1>
                    <br/>
                    <Form onSubmit={filterList}>
                        <Row form>
                            <Col md={6}>
                                <FormGroup className="searchName">
                                    <Label>Name</Label>
                                    <Input type="text" id="searchName"
                                            value={searchName}
                                            onChange={(e) => setSearchName(
                                                e.target.value)}
                                            placeholder="Search by name" />
                                    <Input type="submit" hidden />
                                    <button onClick={(e) =>
                                    {setSearchName('');
                                    e.preventDefault();
                                    }} >X</button>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Location</Label>
                                    <Input type="select"
                                            value={searchLocation}
                                            onChange={(e) => setSearchLocation(e.target.value)}>
                                        <option value="">Any Location</option>
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
                            </Col>
                        </Row>

                        <FormGroup>
                            <Row>
                                <Col xs="auto">
                                    <Button color="success" onClick={filterList}>Search</Button>
                                </Col>
                                <Col xs="auto">
                                    <Button onClick={resetFilters}>Reset</Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>

                    <Table responsive className="workers-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Location</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageWorkers.map(({WorkerId, FirstName, LastName, Location}) => (
                                <tr>
                                    <td>{FirstName}</td>
                                    <td>{LastName}</td>
                                    <td>{Location}</td>
                                    <td>
                                        <Link to={"/admin/worker/" + WorkerId}>
                                            <Button color="success"> View </Button>
                                        </Link>
                                    </td>
                                    <td><Button onClick={() => deleteAccount(WorkerId)} color="danger">Delete</Button></td>
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
                        forcePage={offset / workersPerPage}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'pagination_active'} />
                </div>
            </div>
        </>
    )
}

export default WorkerListPage;
