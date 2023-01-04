import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';

const Datagrid = (props) => {

    const [rowdata, setRowData] = useState([]);
    const [columnDefs, setColDefs] = useState([]);

    useEffect(() => {
        const data = props.data || {}
        if (data.length) {
            let rows = data.map((val, i) => {
                val[1]['id'] = i / 1 + 1;
                return val[1];
            })
            setRowData(rows); //framing row data for data grid and setting it in state
            let keys = Object.keys(rows[0]);
            let cols = [];
            for (let i = keys.length - 1; i >= 0; i--) {
                cols.push({
                    field: keys[i],
                    width: 225,
                    renderHeader: () => (
                        <strong>
                            {
                                keys[i].includes(".") ? keys[i].split(". ")[1].toUpperCase() : keys[i].toUpperCase()
                            }
                        </strong>
                    ),
                })
            }
            setColDefs(cols); //framing columns array and setting in state
        }
    }, [props.data]);

    return (

        <div className="card" style={{ height: '475px' }} >
            <DataGrid rows={rowdata} columns={columnDefs} />
        </div>
    )
}

export default Datagrid;

