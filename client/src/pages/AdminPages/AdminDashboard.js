import React, {useEffect, useState} from 'react';
import {Container, Button, DropdownMenu, DropdownItem, Dropdown, DropdownToggle, FormGroup, Col, Input, Label } from 'reactstrap';
import AdminSideBar from '../../components/AdminSideBar';
import CookieChecker from '../../components/CookieChecker';
import CreateAdminAccount from '../../components/CreateAdminAccount';
import CBRPerformance from '../../components/statistics/CBRPerformance';

import '../../css/AdminDashboard.css';
import axios from 'axios';

function AdminDashboard() {
    const [ toggleCreateAdmin, setToggleCreateAdmin ] = useState(false);
    const [ queryString, setQueryString ] = useState('');
    const [ dropDown, setDropDown ] = useState(false);
    const [ location, setLocation ] = useState('');
    const [ dateStart, setDateStart ] = useState('');
    const [ dateEnd, setDateEnd ] = useState('');

    const toggle = () => setDropDown(prevState => !prevState);

    useEffect(() => {
        setDefaultDate();
    }, []);

    useEffect(() => {
        setParameters();
    }, [dateStart, dateEnd, location]);

    function setDefaultDate() {
        let defaultStartDate = new Date()
        defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);
        defaultStartDate = defaultStartDate.toLocaleDateString('en-GB')
        defaultStartDate = defaultStartDate.replaceAll('/', '-');
        setDateStart(defaultStartDate);
        let defaultEndDate = new Date().toLocaleDateString('en-GB');
        defaultEndDate = defaultEndDate.replaceAll('/', '-');
        setDateEnd(defaultEndDate)
    }

    function setParameters() {
        let string = `?Date=["${dateStart}", "${dateEnd}"]&Location=["${location}"]`
        setQueryString(string)
    }
    // Download excel file
    // Modified from Reference: https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
    function downloadExcelWorkbook(event) {
        let endpoint = event.target.name;
        axios.request({url: `/excel/${endpoint}/${queryString}`,
            method: 'GET',
            responseType: 'blob',
        })
            .then(function (res) {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${endpoint}.xlsx`); // TODO create modal that gets the name for the file
                document.body.appendChild(link);
                link.click();
            })
            .catch(function (err) {
                alert("No results based on filters");
            });
    }

    return(
        <>
            <CookieChecker></CookieChecker>
            <div className='main-content'>
                <AdminSideBar/>

                {toggleCreateAdmin ?
                    <CreateAdminAccount 
                        onClick={() => setToggleCreateAdmin(false)}
                        onSuccess={() => setToggleCreateAdmin(false)}
                    />
                : ''}

                <div className='admin-container'>
                    <h1>Dashboard</h1>
                    <Button onClick={() => setToggleCreateAdmin(true)}>Create New Admin</Button>
                    <h3>Filter and Export Data</h3>
                    <div>Current Location: {location}</div>
                    <Dropdown isOpen={dropDown} toggle={toggle}>
                        <DropdownToggle caret>Location</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={()=>setLocation("")}> All Locations</DropdownItem>
                            <DropdownItem onClick={()=>setLocation("BidiBidi Zone 1")}>BidiBidi Zone 1</DropdownItem>
                            <DropdownItem onClick={()=>setLocation("BidiBidi Zone 2")}>BidiBidi Zone 2</DropdownItem>
                            <DropdownItem onClick={()=>setLocation("BidiBidi Zone 3")}>BidiBidi Zone 3</DropdownItem>
                            <DropdownItem onClick={()=>setLocation("BidiBidi Zone 4")}>BidiBidi Zone 4</DropdownItem>
                            <DropdownItem onClick={()=>setLocation("BidiBidi Zone 5")}>BidiBidi Zone 5</DropdownItem>
                            <DropdownItem onClick={()=>setLocation("Palorinya Basecamp")}>Palorinya Basecamp</DropdownItem>
                            <DropdownItem onClick={()=>setLocation("Palorinya Zone 1")}>Palorinya Zone 1</DropdownItem>
                            <DropdownItem onClick={()=>setLocation("Palorinya Zone 2")}>Palorinya Zone 2</DropdownItem>
                            <DropdownItem onClick={()=>setLocation("Palorinya Zone 3")}>Palorinya Zone 3</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Label>Date Start:</Label>
                        <Input type="datetime" name="dateStart" label="Date:" required="Date required"
                                    value={dateStart}
                               onChange={(event) => {setDateStart(event.target.value)}} />
                    <Label>Date End:</Label>
                    <Input type="datetime" name="dateEnd" label="Date:" required="Date required"
                           value={dateEnd}
                           onChange={(event) => {setDateEnd(event.target.value)}} />
                    <Button name="baselineSurveys" onClick={downloadExcelWorkbook}>Export Baseline Surveys</Button>
                    <Button name="visits" onClick={downloadExcelWorkbook}>Export Visits</Button>
                    <CBRPerformance/>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard;