import React, { useEffect, useState } from 'react';
import { Container, Table, Label, Input } from 'reactstrap'
import BarChart from '../graphs/BarGraph';
import axios from 'axios';

function VisitServicesStatistics() {

    const [ stats, setStats ] = useState([]);
    const [ sortBy, setSortBy ] = useState('Total'); // Need this state for sorting statistics even though it isn't used

    useEffect(() => {
        axios.get('/visits/stats/services')
        .then((response) => {
            generateStats(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])

    // Also counts max value
    function convertToArray(data) {
        let dataArr = [];
        for (var i in data) {
            data[i]['Location'] = i;
            dataArr.push(data[i]);
        }

        setStats(dataArr);
    }

    function generateStats(visitData) {
        const data = {};
        visitData.forEach((visit) => {
            if (!(visit.Client?.Location in data)) {
                data[visit.Client?.Location] = {Total: 0, HealthService: 0, EducationService: 0, SocialService: 0};
            }

            data[visit.Client?.Location].Total += 1;    

            if (visit.HealthFormId !== null)
                data[visit.Client?.Location].HealthService += 1;
            if (visit.EducationFormId !== null)
                data[visit.Client?.Location].EducationService += 1;
            if (visit.SocialFormId !== null)
                data[visit.Client?.Location].SocialService += 1;
        })

        // Need to convert to array to be used by the table / graph
        convertToArray(data);
    }

    // Reference: https://stackoverflow.com/a/46848788
    function sortByStats(sortBy) {
        stats.sort((a, b) => {
            if (a[sortBy] < b[sortBy])
                return 1;
            else if (a[sortBy] > b[sortBy])
                return -1;
            else
                return 0;
        })
        setStats(stats);
    }

    return (
        <Container>
            <div style={{height: '400px'}}>
                <BarChart data={stats} keys={['Total', 'HealthService', 'EducationService', 'SocialService']} groupBy="Location" xAxisLabel="Client Location" yAxisLabel="Count" keyAttr="Location" legendOn/>
            </div>
            <Label>Sort by</Label>
            <Input type="select"
             onChange={(e) => {
                setSortBy(e.target.value);
                sortByStats(e.target.value);
             }}>
                <option value="Total">Total Visits</option>
                <option value="HealthService">Health Visits</option>
                <option value="EducationService">Education Visits</option>
                <option value="SocialService">Social Visits</option>
            </Input>
            <Table>
                <thead>
                    <tr>
                        <th>Client Location</th>
                        <th>Total Visits</th>
                        <th>Health Visits</th>
                        <th>Education Visits</th>
                        <th>Social Visits</th>
                    </tr>
                </thead>
                <tbody>
                {stats.map(({Location, Total, HealthService, EducationService, SocialService}) => (
                    <tr>
                        <td>{Location}</td>
                        <td>{Total}</td>
                        <td>{HealthService}</td>
                        <td>{EducationService}</td>
                        <td>{SocialService}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default VisitServicesStatistics;
