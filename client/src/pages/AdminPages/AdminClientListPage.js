import React, {useState} from 'react';
import { Container, Button } from 'reactstrap';
import AdminSideBar from '../../components/AdminSideBar';
import CookieChecker from '../../components/CookieChecker';
import ClientListPage from '../ClientPages/ClientListPage';

import '../../css/AdminDashboard.css';

function AdminClientListPage() {
    return(
        <>
            <CookieChecker></CookieChecker>
            <div className='main-content'>
                <AdminSideBar/>

                <div className='admin-container'>
                    <ClientListPage/>
                </div>
            </div>
        </>
    )
}

export default AdminClientListPage;