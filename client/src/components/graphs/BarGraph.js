import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';

function BarChart(props) {

    const { data, keys, keyAttr, groupBy, legendOn, xAxisLabel, yAxisLabel } = props;

    const [ maxValue, setMaxValue ] = useState(0);
    
    useEffect(() => {
        let count = 0;

        data.forEach((entry) => {
            if (entry[keyAttr] > count)
                count = entry[keyAttr];
        })

        setMaxValue(count);
    }, [])

    return (
        // Reference: https://nivo.rocks/bar/
        <ResponsiveBar
            data={data}
            keys={keys}
            indexBy={groupBy}
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: xAxisLabel || groupBy,
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickValues: maxValue || 5,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: yAxisLabel || keyAttr,
                legendPosition: 'middle',
                legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            legends={(legendOn) ? (
                [
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]
            ) : []}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
    )
}

export default BarChart;
