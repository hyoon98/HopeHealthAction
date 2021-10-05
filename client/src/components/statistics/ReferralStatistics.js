import React, { useEffect, useState } from 'react';
import { Container, Table, Label, Input } from 'reactstrap'
import BarChart from '../graphs/BarGraph';
import axios from 'axios';

function ReferralStatistics() {

    const [ stats, setStats ] = useState([]);
    const [ sortBy, setSortBy ] = useState('Total'); // Need this state for sorting statistics even though it isn't used

    useEffect(() => {
        axios.get('/referrals/stats/location')
        .then((response) => {
            setStats(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])

    // Reference: https://stackoverflow.com/a/46848788
    function sortByStats(sortBy) {
        stats.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return 1;
            if (a[sortBy] > b[sortBy]) return -1;
            else return 0;
        })
        setStats(stats);
    }

    return (
        <Container>
            <div style={{height: '400px'}}>
                <BarChart data={stats} keys={['Total', 'Made', 'Resolved']} keyAttr="Total" groupBy="Location" xAxisLabel="Location" yAxisLabel="Count" legendOn/>
            </div>
            <Label>Sort by</Label>
            <Input type="select"
             onChange={(e) => {
                setSortBy(e.target.value);
                sortByStats(e.target.value);
             }}>
                <option value="Total">Total</option>
                <option value="Made">Made</option>
                <option value="Resolved">Resolved</option>
            </Input>
            <Table>
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Total</th>
                        <th>Made</th>
                        <th>Resolved</th>
                    </tr>
                </thead>
                <tbody>
                {stats.map(({Location, Total, Made, Resolved}) => (
                    <tr>
                        <td>{Location}</td>
                        <td>{Total}</td>
                        <td>{Made}</td>
                        <td>{Resolved}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default ReferralStatistics;
