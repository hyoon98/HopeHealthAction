import React from 'react';
import AdminSideBar from '../../components/AdminSideBar';
import CookieChecker from '../../components/CookieChecker';
import VisitLocationStatistics from '../../components/statistics/VisitLocationStatistics';
import ReferralStatistics from '../../components/statistics/ReferralStatistics';
import VisitServicesStatistics from '../../components/statistics/VisitServicesStatistics';
import SurveyStatistics from '../../components/statistics/SurveyStatistics';
import { WorkerTotalVisitsGraph } from '../../components/graphs/WorkerGraphs';
import { WeeklyNewClientsCountGraph } from '../../components/graphs/ClientGraphs'; 

function AdminInsights() {
    return(
        <>
            <CookieChecker/>

            <div className='main-content'>
                <AdminSideBar/>

                <div className='admin-container'>
                    <h1>Insights</h1>

                    <div class='admin-grid'>
                        <div class='admin-card' data-title='CBR Visits (Total)'>
                            <div style={{ height: 300 }}>
                                <WorkerTotalVisitsGraph/>
                            </div>
                        </div>

                        <div class='admin-card' data-title='New Client Signup (Last 7 days)'>
                            <div style={{ height: 300 }}>
                                <WeeklyNewClientsCountGraph/>
                            </div>
                        </div>

                        <div class='admin-card' data-title='Referral Statistics' style={{gridColumn: '1 / -1'}}>
                            <ReferralStatistics/>
                        </div>

                        <div class='admin-card' data-title='Visit Statistics' style={{gridColumn: '1 / -1'}}>
                            <VisitLocationStatistics/>
                            <VisitServicesStatistics/>
                        </div>

                        <div class='admin-card' data-title='Survey Statistics' style={{gridColumn: '1 / -1'}}>
                            <SurveyStatistics/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AdminInsights;