import React, { useState, useEffect } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import axios from 'axios'
import moment from 'moment'

const WeeklyNewClientsCountGraph = () => {
	const [data, setData] = useState([])

	async function getWeeklyClientCountData() {
		try {
			const allClients = (await axios.get('/clients')).data
			const startOfWeek = moment().day(0).format()
			const endOfWeek = moment().subtract(6, 'days').days(0).format()
            console.log(startOfWeek)
            console.log(endOfWeek)
			const weeklyCounts = [0, 0, 0, 0, 0, 0, 0]
			
			allClients.forEach((client) => {
				let clientDate = moment(client.DateCreated)

				if (clientDate.isBetween(startOfWeek, endOfWeek, 'days', '[]')) {
					const index = clientDate.diff(startOfWeek, 'days') + 1
					weeklyCounts[index]++
				}
			})

			const data = weeklyCounts.map((count, i) => {
				return ({
					'date': moment().subtract(i, 'days').day(i).format('DD-MM-YYYY'),
					'count': count	
				})
			})

			setData(data)
			
		} catch(err) {
			setData([])
		}
	}

	useEffect(getWeeklyClientCountData, [])

	return (
    <ResponsiveBar
        data={data}
        keys={[ 'count' ]}
        indexBy="date"
        margin={{ top: 0, right: 20, bottom: 40, left: 50 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'date',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
						tickValues: 1,
            tickRotation: 0,
            legend: 'count',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
	)
}

export { WeeklyNewClientsCountGraph }