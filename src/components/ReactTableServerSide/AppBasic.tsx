import React, {createRef, useRef, useState} from "react";
import makeData from "./makeData";
import BasicTable from "./BasicTable";

const serverData = makeData(15);

export default function AppServerSide() {
    const [data, setData] = useState([]);
    const [totalRowData, setTotalRowData]= useState(undefined);
    const tableRef = useRef();

    /**
     * Table columns
     */
    const columns = React.useMemo(() =>
            [
                {
                    Header: "First Name",
                    accessor: "firstName",
                    width: 50,
                },
                {
                    Header: "Last Name",
                    accessor: "lastName",
                    width: 50,
                },
                {
                    Header: "Age",
                    accessor: "age",
                    width: 50,
                    Cell: (row:any) => {
                        let group = 'Enfance'
                        let color = 'bg-green-400'
                        if(row.value >= 15 && row.value <= 24){
                            group = 'Adolescent'
                            color = 'bg-blue-400'
                        }else if(row.value >= 25 && row.value <= 64){
                            group = 'Adulte'
                            color = 'bg-red-400'
                        }else if(row.value >= 65){
                            group = 'Aînés'
                            color = 'bg-yellow-400'
                        }
                        return(<span className={`${color} rounded-full text-white p-1`}>{group}</span>)
                    },
                },
            ]
        ,[]
    )

    /**
     * OnRowClick Function
     * @param row
     */
    const handleRowClick = ((row: any) => { console.log(row) })

    /**
     * Fetch Data
     */
    const fetchData = React.useCallback(() => {
        // update Data
        setData(serverData)
        // update totalRowData
        setTotalRowData(   {
            rowStyle: 'bg-blue-300 text-sm font-bold',
            colStyle: 'p-2',
            data: ['', null, 30]
        });

    }, []);

    return (
        <React.Fragment>
            <BasicTable
                tableRef={tableRef}
                columns={columns}
                data={data}
                fetchData={fetchData}
                handleRowClick={handleRowClick}
                totalRowData={totalRowData}
            />
        </React.Fragment>
    );
}
