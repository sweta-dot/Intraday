import React from 'react';
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const HighchartsComponent = ({ data, handleTimeFrameChange }) => {

    const { "Meta Data": metaData, "Time Series (5min)": fiveMinData } = data

    var ohlc = [],
        volume = [],
        chartData = (fiveMinData && Object.entries(fiveMinData)) || [],
        dataLength = chartData.length,
        groupingUnits = [
            [
                'millisecond', // unit name
                [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
            ], [
                'second',
                [1, 2, 5, 10, 15, 30]
            ], [
                'minute',
                [1, 2, 5, 10, 15, 30]
            ], [
                'hour',
                [1, 2, 3, 4, 6, 8, 12]
            ], [
                'day',
                [1]
            ], [
                'week',
                [1]
            ], [
                'month',
                [1, 3, 6]
            ], [
                'year',
                null
            ]
        ];

    //mutating data for loading charts
    for (let i = dataLength - 1; i >= 0; i--) {
        const time = (new Date(chartData[i][0])).getTime();
        const { "1. open": open, "2. high": high, "3. low": low, "4. close": close, "5. volume": vol } = chartData[i][1]

        ohlc.push([time, open / 1, high / 1, low / 1, close / 1]);
        volume.push([time, vol / 1]);
    }

    //options for chart
    const options = {
        rangeSelector: {
            selected: 1,

        },

        title: {
            text: metaData && metaData["2. Symbol"] + " Intraday time series data"
        },

        xAxis: {
            events: {
                setExtremes: function (e) {
                    console.log("e", e)
                    if (e.trigger === 'rangeSelectorInput' || e.trigger === "rangeSelectorButton" || (e.trigger === 'navigator' && (e.DOMEvent.type === 'mouseup' || e.DOMEvent.type === 'touchend'))) {
                        handleTimeFrameChange(e)
                    }
                }
            }
        },

        yAxis: [
            {
                labels: {
                    align: "left",
                    x: -3
                },
                title: {
                    text: metaData && metaData["1. Information"]
                },
                height: "60%",
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            },
            {
                labels: {
                    align: "left",
                    x: -3
                },
                title: {
                    text: "Volume"
                },
                top: "65%",
                height: "35%",
                offset: 0,
                lineWidth: 2
            }
        ],

        tooltip: {
            split: true
        },

        exporting: {
            showTable: true
        },

        series: [
            {
                type: "candlestick",
                name: metaData && metaData["2. Symbol"],
                data: ohlc,
                dataGrouping: {
                    units: groupingUnits
                }
            },
            {
                type: "column",
                name: "Volume",
                data: volume,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }
        ]
    };

    return (

        <div className="card">
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={"stockChart"}
                options={options}
            />
        </div>
    )
}

export default HighchartsComponent