import React, { useEffect, useState } from 'react';
import BarChart from '../graphs/BarGraph';
import axios from 'axios';

function CBRPerformance() {

    const [mostVisits, setMostVisits] = useState([])
    const [leastVisits, setLeastVisits] = useState([])
    const [mostReferrals, setMostReferrals] = useState([])
    const [leastReferrals, setLeastReferrals] = useState([])

    useEffect(() => {
        axios.get('/workers/mostVisits')
        .then(response => {
            const stats = extractStats(response.data)
            setMostVisits(stats)
        })
        .catch(error => console.log(error))

        axios.get('/workers/leastVisits')
        .then(response => {
            const stats = extractStats(response.data)
            setLeastVisits(stats)
        })
        .catch(error => console.log(error))

        axios.get('/workers/mostReferrals')
        .then(response => {
            const stats = extractStats(response.data)
            setMostReferrals(stats)
        })
        .catch(error => console.log(error))

        axios.get('/workers/leastReferrals')
        .then(response => {
            const stats = extractStats(response.data)
            setLeastReferrals(stats)
        })
        .catch(error => console.log(error))
    }, [])

    function extractStats(workers) {
        let stats = []
        workers.forEach(worker => {
            let stat = {}
            stat['Worker'] = worker.Worker.FirstName + ' ' + worker.Worker.LastName
            stat['Count'] = worker.statcount
            stats.push(stat)
        })

        return stats
    }

    return (
        <div>
            <div class="admin-card" data-title="Top 5 CBR Workers Carrying The Most Visits" style={{marginTop: '50px'}}>
                <div style={{height: '400px'}}>
                    <BarChart data={mostVisits} keys={['Count']} keyAttr="Count" groupBy="Worker" xAxisLabel="Worker" yAxisLabel="Count"/>
                </div>
            </div>
            <div class="admin-card" data-title="Top 5 CBR Workers Carrying The Least Visits" style={{marginTop: '50px'}}>
                <div style={{height: '400px'}}>
                    <BarChart data={leastVisits} keys={['Count']} keyAttr="Count" groupBy="Worker" xAxisLabel="Worker" yAxisLabel="Count"/>
                </div>
            </div>
            <div class="admin-card" data-title="Top 5 CBR Workers Carrying The Most Referrals" style={{marginTop: '50px'}}>
                <div style={{height: '400px'}}>
                    <BarChart data={mostReferrals} keys={['Count']} keyAttr="Count" groupBy="Worker" xAxisLabel="Worker" yAxisLabel="Count"/>
                </div>
            </div>
            <div class="admin-card" data-title="Top 5 CBR Workers Carrying The Least Referrals" style={{marginTop: '50px'}}>
                <div style={{height: '400px'}}>
                    <BarChart data={leastReferrals} keys={['Count']} keyAttr="Count" groupBy="Worker" xAxisLabel="Worker" yAxisLabel="Count"/>
                </div>
            </div>
        </div>
    )
}

export default CBRPerformance;