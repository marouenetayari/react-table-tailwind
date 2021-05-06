import React, { useState } from "react";
import makeData from "./makeData";
import TableServerSide from './Table'
import { MdNewReleases } from "react-icons/md";

const serverData = makeData(100);
const endPoitUrl = 'https://api.instantwebtools.net/v1/passenger'
const handleEndPoit = (pageSize = 20, pageIndex = 0, sortBy = '[]') => {
    fetch(`${endPoitUrl}?page=${pageIndex}&size=${pageSize}`)
        .then(response => response.json())
        .then(data =>
            console.log(data) // here I get 500000 items
        )
}
export default function AppServerSide() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [pageCount, setPageCount] = React.useState(0);
    const fetchIdRef = React.useRef(0);
    const sortIdRef = React.useRef(0);

    interface Data {
        firstname: string,
        lastname: string,
        age: number
    }

    const columns =
        // React.useMemo(() =>
            [
                {
                    Header: "First Name",
                    accessor: "firstName",
                    width: 50,
                },
                {
                    Header: "Last Name",
                    id: "lastName",
                    accessor: (d:any) => d.lastName,
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
                {
                    Header: "Visits",
                    accessor: "visits",
                    width: 50,
                },
                {
                    Header: "Progress",
                    accessor: "progress",
                    width: 50,
                },
                {
                    Header: "Status",
                    accessor: "status",
                    width: 50,
                },
                {
                    Header: "KPI 1",
                    accessor: "col_1",
                    width: 50,
                    minWidth: 50,
                },
                {
                    Header: "KPI 2",
                    accessor: "col_2",
                    width: 50,
                },
                {
                    Header: "KPI 3",
                    accessor: "col_3",
                    width: 50,
                    // minWidth: 50,
                    // align: 'right',

                },
                {
                    Header: "KPI 4",
                    accessor: "col_4",
                    width: 50,
                    // mithnWidth: 50,
                    // align: 'right',
                },
                {
                    Header: "KPI 5",
                    accessor: "col_5",
                    width: 50,
                    // minWid: 50,
                    // align: 'right',
                }
            ]
// ,[])

    /**
     * OnRowClick Function
     * @param row
     */
    function handleRowClick(row: any){
        console.log(row)
    }

    /**
     * Fetch Data
     */
    const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy }) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.


        // console.log(`page size : ${pageSize}, pageIndex : ${pageIndex} et SortedBy : ${sortBy}`)
        // console.log(sortBy)
        // handleEndPoit(pageSize, pageIndex, sortBy)

        // Give this fetch an ID
        const fetchId = ++fetchIdRef.current;

        // Set the loading state
        setLoading(true);

        // We'll even set a delay to simulate a server here
        setTimeout(() => {
            // Only update the data if this is the latest fetch
            if (fetchId === fetchIdRef.current) {
                const startRow = pageSize * pageIndex;
                const endRow = startRow + pageSize;
                if (sortBy.length === 0) {
                    setData(serverData.sort().slice(startRow, endRow));
                } else {
                    setData(
                        serverData
                            .sort((a:any, b:any) => {
                                const field = sortBy[0].id;
                                const desc = sortBy[0].desc;
                                if (a[field] < b[field]) {
                                    return desc ? -1 : 1;
                                }
                                if (a[field] > b[field]) {
                                    return desc ? 1 : -1;
                                }
                                return 0;
                            })
                            .slice(startRow, endRow)
                    );
                }

                // Your server could send back total page count.
                // For now we'll just fake it, too
                setPageCount(Math.ceil(serverData.length / pageSize));

                setLoading(false);
            }
        }, 100);
    }, []);

    return (
        <React.Fragment>
            <TableServerSide
                columns={columns}
                data={data}
                fetchData={fetchData}
                loading={loading}
                pageCount={pageCount}
                handleRowClick={handleRowClick}
                manual // informs React Table that you'll be handling sorting and pagination server-side
            />
        </React.Fragment>
    );
}
