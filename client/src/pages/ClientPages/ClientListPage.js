import React, { useState, useEffect, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { UserContext } from '../../components/UserContext';
import axios from "axios";
import ReactPaginate from 'react-paginate';
import CookieChecker from '../../components/CookieChecker';
import AdminSideBar from '../../components/AdminSideBar';
import moment from 'moment';

import { Form,
        FormGroup,
        Label,
        Input,
        Row,
        Col,
        Container,
        Button,
        Table,
        Collapse,
        ListGroup,
        ListGroupItem,
        ListGroupItemHeading,
        ListGroupItemText } from 'reactstrap';

import "../../css/ClientList.css";


const buttonColor={color:"white",backgroundColor:"#46ad2f"}

const formatDateStr = (dateStr) => {
    // reference: https://stackoverflow.com/a/66409911
    const date = new Date(dateStr)
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // month is zero-based
    const dd = String(date.getDate()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy}`;
}


function ClientListPage() {

   const [ refresh, setRefresh ] = useState(0);
   const [ offset, setOffset ] = useState(0);
   const [ pageCount, setPageCount ] = useState(0);
   const [ clients, setClients ] = useState([]);
   const [ currentPageClients, setCurrentPageClients ] = useState([]);
   const [ filteredClients, setFilteredClients ] = useState(['']);

   const [ radioFilter, setRadioFilter ] = useState('');
   const [ searchName, setSearchName ] = useState('');
   const [ searchAge, setSearchAge ] = useState('');
   const [ searchGender, setSearchGender ] = useState('');
   const [ searchLocation, setSearchLocation ] = useState('BidiBidi Zone 1');
   const [ searchVillageNo, setSearchVillageNo ] = useState('');
   const [ searchDisability, setSearchDisability ] = useState('Amputee');
   const [ searchDateFrom, setSearchDateFrom ] = useState((new Date()).toLocaleDateString('en-CA'));
   const [ searchDateTo, setSearchDateTo ] = useState((new Date()).toLocaleDateString('en-CA'));

   const [isOpenAge, setIsOpenAge] = useState(false);
   const [isOpenGender, setIsOpenGender] = useState(false);
   const [isOpenLocation, setIsOpenLocation] = useState(false);
   const [isOpenVillageNo, setIsOpenVillageNo] = useState(false);
   const [isOpenDisability, setIsOpenDisability] = useState(false);
   const [isOpenDate, setIsOpenDate] = useState(false);
   const [isAdmin, setIsAdmin] = useState(false);

   const context = useContext(UserContext);
   const history = useHistory();
   const clientsPerPage = 30;

   useEffect(() => {
       if(context.Role === 'Admin') {
           setIsAdmin(true)
       }
   }, [])

    useEffect(() => {
        axios.get('/clients')
            .then(function (res) {
            setClients(res.data);
            if (filteredClients[0] === '') {
                setFilteredClients(res.data);
                setClientPages(res.data);
            }
            })
            .catch(function (err) {
                console.log(err);
            });
    }, [refresh]);

    useEffect(() => {
        // date filter to have valid range
        const dateFrom = new Date(searchDateFrom)
        const dateTo = new Date(searchDateTo)
        if (dateFrom > dateTo) setSearchDateTo(searchDateFrom)
    }, [searchDateFrom, searchDateTo])

    useEffect(() => {
        setClientPages(filteredClients);
    }, [offset]);

    useEffect(() => {
        document.title="Client List"
      }, [])

    function setClientPages(relevantClients) {
        setPageCount(Math.ceil(relevantClients.length / clientsPerPage));
        let currentPage = relevantClients.slice(offset, offset + clientsPerPage);
        setCurrentPageClients(currentPage);
    }

    function searchFor(client) {
        let lowerSearchName = searchName.toLowerCase().split(' ');
        let lowerClientFirstName = client.FirstName.toLowerCase();
        let lowerClientLastName = client.LastName.toLowerCase();
        let numFilters = 0;
        let numFiltersMatching = 0;

        if (isOpenAge) {
            if (client.Age === Number(searchAge)) {
                numFiltersMatching++;
            }
            numFilters++;
        }
        if (isOpenGender) {
            if (client.Gender === searchGender) {
                numFiltersMatching++;
            }
            numFilters++;
        }
        if (isOpenLocation) {
            if (client.Location === searchLocation) {
                numFiltersMatching++;
            }
            numFilters++;
        }
        if (isOpenVillageNo) {
            if (client.VillageNumber === Number(searchVillageNo)) {
                numFiltersMatching++;
            }
            numFilters++;
        }
        if (isOpenDisability) {
            if ((client.DisabilityType || []).includes(searchDisability)) {
                numFiltersMatching++;
            }
            numFilters++;
        }
        if (isOpenDate) {
            const dateFrom = new Date(searchDateFrom)
            const dateTo = new Date(searchDateTo)
            const dateCreated = new Date(client.DateCreated)
            dateFrom.setDate(dateFrom.getDate() + 1)
            dateTo.setDate(dateTo.getDate() + 1)
            dateFrom.setHours(0,0,0,0)
            dateTo.setHours(0,0,0,0)
            dateCreated.setHours(0,0,0,0)

            if (dateCreated >= dateFrom && dateCreated <= dateTo) {
                numFiltersMatching++;
            }
            numFilters++;
        }

        lowerSearchName.forEach(name => {
            if (name === lowerClientFirstName || name === lowerClientLastName || name === '') {
                numFilters++;
                numFiltersMatching++;
            } else {
                numFiltersMatching--;
            }
        });


        return numFilters === numFiltersMatching;
    }

    function sortBy(property) {
        return function(a, b) {
            if (a[ property ] < b[ property ]) {
                return 1;
            } else if (a[ property ] > b[ property ]) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    function filterList(event) {
        event.preventDefault();
        setRefresh(refresh + 1);
        setOffset(0);

        let sorted_clients;
        let searched_clients;
        sorted_clients = clients.sort(sortBy(radioFilter));
        searched_clients = sorted_clients.filter(searchFor);
        setFilteredClients(searched_clients);
        setClientPages(searched_clients);
    }

    function resetFilters() {
        setIsOpenAge(false);
        setIsOpenGender(false);
        setIsOpenLocation(false);
        setIsOpenVillageNo(false);
        setIsOpenDisability(false);
        setIsOpenDate(false);
        setSearchName('');
        setSearchGender('');
        setRadioFilter('');
        setSearchAge('');
        setSearchLocation('BidiBidi Zone 1');
        setSearchVillageNo('');
        setSearchDisability('Amputee');
        setSearchDateFrom((new Date()).toLocaleDateString('en-CA'));
        setSearchDateTo((new Date()).toLocaleDateString('en-CA'));

        setOffset(0);
        setFilteredClients(clients);
        setClientPages(clients);
        setRefresh(refresh + 1);
    }

    function setFilters(event) {

        switch(event.target.value) {
            case 'Age':
                setIsOpenAge(!isOpenAge);
                break;
            case 'VillageNumber':
                setIsOpenVillageNo(!isOpenVillageNo)
                break;
            case 'Gender':
                setIsOpenGender(!isOpenGender);
                break
            case 'Location':
                setIsOpenLocation(!isOpenLocation);
                break
            case 'DisabilityType':
                setIsOpenDisability(!isOpenDisability);
                break;
            case 'Date':
                setIsOpenDate(!isOpenDate);
                break;
            default:
        }
    }

    function handlePageClick(event) {
        setOffset(event.selected * clientsPerPage);
    }

    function convertFiltersToJSON() {
        let names = searchName.split(' ');
        let filters = '{  "filters": {';
        for (let i = 0; i < names.length; i++) {
            names[i] = names[i].charAt(0).toUpperCase() + names[i].slice(1).toLowerCase();
            if (i > 1) {
                names.splice(i);
            }
        }

        if(isOpenAge) {
            filters = filters.concat(`"Age": ${Number(searchAge)},`);
        }
        if(isOpenGender) {
            filters = filters.concat(`"Gender": "${searchGender}",`);
        }
        if(isOpenLocation) {
            filters = filters.concat(`"Location": "${searchLocation}",`);
        }
        if(isOpenVillageNo) {
            filters = filters.concat(`"VillageNumber": ${Number(searchVillageNo)},`);
        }
        if(isOpenDisability) {
            filters = filters.concat(`"DisabilityType": "${searchDisability}",`);
        }
        if(isOpenDate) {
            filters = filters.concat(`"DateCreated: { $between: ["${searchDateFrom}", ${searchDateTo}] }"`)
        }

        if (names.length === 2) {
            filters = filters.concat(`"FirstName": "${names[0]}", "LastName": "${names[1]}"`);
        } else {
            if (!(names[0] === '')) {
                filters = filters.concat(`"FirstName": "${names[0]}"`);
            }
        }
        if (filters.endsWith(',')) {
            filters = filters.slice(0, -1);
        }

        filters = filters.concat(`}, "sortBy": "${radioFilter}"}`)
        filters = JSON.parse(filters);

        return filters;
    }

    // Download excel file
    // Modified from Reference: https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
    function downloadExcelWorkbook() {
        // Not allowed to create an empty workbook
        if (filteredClients.length === 0) {
            alert("Cannot export an empty list");
            return;
        }

        let filters = convertFiltersToJSON();

        axios.request({url: '/excel',
                             method: 'GET',
                             params: filters,
                             responseType: 'blob',
            })
            .then(function (res) {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'clients.xlsx'); // TODO create modal that gets the name for the file
                document.body.appendChild(link);
                link.click();
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    return (
        <div className="container-size">
        <CookieChecker></CookieChecker>
        <div>
            <Container className={`ClientList ${isAdmin ? "admin-container" : ""}`}>
                <Container className='Title'>
                    <h1 style={{color:"#9646b7f"}}>Client List</h1>
                    {!isAdmin ? 
                    <Link to="/client/new" style={{color:"#22a9ba"}}>+ Create new client</Link>
                    : ''}
                </Container>
                <Form onSubmit={filterList}>
                    <FormGroup className="SearchName">
                        <Input type="text" id="searchName"
                            value={searchName}
                            onChange={(event) => setSearchName(
                                event.target.value)}
                            placeholder="Search by name" />
                        <Input type="submit" hidden />
                        <button onClick={(e) =>
                        {setSearchName('');
                        e.preventDefault();
                        }} >X</button>

                    </FormGroup>
                    <Container className='SortSection'>
                        <FormGroup tag="radioFilter"
                                value={radioFilter}
                                onChange={(event) => setRadioFilter(event.target.value)} >
                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="sortRadio" value="Priority"
                                        checked={radioFilter === 'Priority'} />
                                    By Priority
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" name="sortRadio" value="DateCreated"
                                        checked={radioFilter === 'DateCreated'} />
                                    Recently Added
                                </Label>
                            </FormGroup>
                        </FormGroup>
                    </Container>
                    <Container className='ChooseFilters'>
                        <Label>Filters</Label>
                        <Button style={{color:"white", backgroundColor:"red"}}
                                onClick={downloadExcelWorkbook}>Export</Button>
                        <Button onClick={filterList} style={buttonColor}>Apply Filters</Button>
                        <Button onClick={resetFilters} style={buttonColor}>Reset</Button>
                        <FormGroup onChange={setFilters}>
                            <Row>
                                <Col xs="auto">
                                    <Input checked={isOpenAge} type="checkbox" value="Age"/>
                                    Age
                                </Col>
                                <Col xs="auto">
                                    <Input checked={isOpenGender} type="checkbox" value="Gender"/>
                                    Gender
                                </Col>
                                <Col xs="auto">
                                    <Input checked={isOpenLocation} type="checkbox" value="Location"/>
                                    Zone
                                </Col>
                                <Col xs="auto">
                                    <Input checked={isOpenVillageNo} type="checkbox" value="VillageNumber"/>
                                    Village Number
                                </Col>
                                <Col xs="auto">
                                    <Input checked={isOpenDisability} type="checkbox" value="DisabilityType"/>
                                    Type of Disability
                                </Col>
                                <Col xs="auto">
                                    <Input checked={isOpenDate} type="checkbox" value="Date"/>
                                    New client date
                                </Col>
                            </Row>
                        </FormGroup>
                        <Collapse isOpen={isOpenAge}>
                            <FormGroup>
                                <Label>Age</Label>
                                <Input type="number"
                                    value={searchAge}
                                    min="1"
                                    onChange={(event) =>
                                            setSearchAge(event.target.value)}
                                    placeholder="Age" />
                            </FormGroup>
                        </Collapse>
                        <Collapse isOpen={isOpenGender}>
                            <FormGroup onChange={(event) => setSearchGender(event.target.value)}>
                                <Label>Gender</Label>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="genderRadio" value="Male"
                                            checked={searchGender === 'Male'}/>
                                        Male
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="genderRadio" value="Female"
                                            checked={searchGender === 'Female'}/>
                                        Female
                                    </Label>
                                </FormGroup>
                            </FormGroup>
                        </Collapse>
                        <Collapse isOpen={isOpenLocation}>
                            <FormGroup>
                                <Label>Zone</Label>
                                <Input type="select"
                                    value={searchLocation}
                                    onChange={(event) => setSearchLocation(event.target.value)}>
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
                        </Collapse>
                        <Collapse isOpen={isOpenVillageNo}>
                            <FormGroup>
                                <Label>Village No</Label>
                                <Input type="number"
                                    min="1"
                                    value={searchVillageNo}
                                    onChange={(event) => setSearchVillageNo(
                                        event.target.value)}
                                    placeholder="Village Number" />
                            </FormGroup>
                        </Collapse>
                        <Collapse isOpen={isOpenDisability}>
                            <FormGroup>
                                <Label>Disability Type</Label>
                                <Input type="select"
                                    value={searchDisability}
                                    onChange={(event) => setSearchDisability(event.target.value)}>
                                    <option value="Amputee">Amputee</option>
                                    <option value="Polio">Polio</option>
                                    <option value="Spinal Cord Injury">Spinal Cord Injury</option>
                                    <option value="Cerebral Palsy">Cerebral Palsy</option>
                                    <option value="Spina Bifida">Spina Bifida</option>
                                    <option value="Hydrocephalus">Hydrocephalus</option>
                                    <option value="Visual Impairment">Visual Impairment</option>
                                    <option value="Hearing Impairment">Hearing Impairment</option>
                                    <option value="Don\'t Know">Don\'t Know</option>
                                    <option value="Other">Other</option>
                                </Input>
                            </FormGroup>
                        </Collapse>
                        <Collapse isOpen={isOpenDate}>
                            <div style={{ 'columnCount': 2, 'maxWidth': '500px' }}>
                                <Label>From</Label>
                                <Input
                                    name="Date"
                                    label="From"
                                    type="date"
                                    value={searchDateFrom}
                                    onChange={(event) => setSearchDateFrom(event.target.value)}
                                />

                                <Label>To</Label>
                                <Input
                                    name="Date"
                                    label="To"
                                    type="date"
                                    value={searchDateTo}
                                    onChange={(event) => setSearchDateTo(event.target.value)}
                                />
                            </div>
                        </Collapse>
                    </Container>
                </Form>
                <ListGroup flush className="clientList">
                    {filteredClients.length > 0 ? filteredClients.map(renderRow) :
                        <ListGroupItem>No clients to show</ListGroupItem>}
                </ListGroup>

                <ReactPaginate previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={2}
                            onPageChange={handlePageClick}
                            forcePage={offset / clientsPerPage}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'pagination_active'}/>

            </Container>
        </div>
        </div>
    )

    function renderRow(client) {
        return (
            <ListGroupItem className="clientRow"
            key={client.ClientId} tag={Link} to={`/client/${client.ClientId}`} action>
                <ListGroupItemHeading className="listHeader">
                    <b>{client.FirstName} {client.LastName} </b>
                </ListGroupItemHeading>
                <ListGroupItemText>
                    <p className="clientRowText">
                        <b>Age:</b> {client.Age}
                        <br/><b>Gender:</b> {client.Gender}
                        <br/><b>Location:</b> {client.Location} <b>No.</b> {client.VillageNumber}
                        <br/><b>Disability:</b> {(client.DisabilityType || []).join(', ')}
                    </p>
                    <p className="dateText"><i>Created {formatDateStr(client.DateCreated)}</i></p>
                </ListGroupItemText>
            </ListGroupItem>
        );
    }
}

export default ClientListPage;