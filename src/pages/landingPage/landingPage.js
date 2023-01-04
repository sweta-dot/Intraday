import React, { useCallback } from "react";
import { useEffect, useState } from 'react';
import HighchartsComponent from "../../components/highcharts";
import Datagrid from "../../components/datagrid";
import debounce from 'lodash.debounce';

const LandingPage = () => {
    const [seriesData, setSeriesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        getData();
    }, [])

    //fetch data from api
    const getData = (symbol = "IBM") => {
        fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' + symbol + '&interval=5min&outputsize=full&apikey=demo')
            .then(response => response.json())
            .then((result) => {
                setSeriesData(result)
                setFilteredData(result['Time Series (5min)'] && Object.entries(result['Time Series (5min)']))
            })
    }

    //function call for symbol change
    const handleSymbolChange = (e) => {
        let symbol = e.target.value;
        getData(symbol)
    }

    //function to trigger symbol change after a delay of 200ms
    const debouncedChangeHandler = useCallback(
        debounce(handleSymbolChange, 200)
        , []);

    //get updated time range and filter table data on the basis of selected range
    const handleTimeFrameChange = (range) => {
        if (seriesData["Time Series (5min)"]) {
            const fiveMinSeriesData = Object.entries(seriesData["Time Series (5min)"])
            let arr = fiveMinSeriesData.filter((el) => {
                const timeStamp = (new Date(el[0])).getTime()
                return (range.min <= timeStamp && timeStamp <= range.max)
            })
            setFilteredData(arr);
        }
    }

    return (
        <>
            <div >
                <label>
                    Symbol:
                    <input type="text" name="symbol" onChange={debouncedChangeHandler} placeholder="Enter symbol to load data" />
                </label>
            </div>
            {seriesData && <HighchartsComponent data={seriesData} handleTimeFrameChange={handleTimeFrameChange} />}
            {filteredData && filteredData.length && <Datagrid data={filteredData} />}
        </>

    )
}

export default LandingPage;