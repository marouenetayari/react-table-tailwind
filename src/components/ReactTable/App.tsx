import * as React from 'react'
import { Table } from './Table'
import { makeData, makeData2, Tips } from "./makeData";
import {useCallback, useState} from "react";

export default function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = React.useState(false);

    // Sorting
    const sortIdRef = React.useRef(0);

    // Fetch Data
    const [pageCount, setPageCount] = React.useState(0);
    const fetchIdRef = React.useRef(0);

    // Pagination
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const columns = React.useMemo(
        () => [
            { Header: 'Id', accessor: 'id' },
            { Header: 'first_name', accessor: 'first_name' },
            { Header: 'last_name', accessor: 'last_name' },
            { Header: 'email', accessor: 'email' },
            { Header: 'date_of_birth', accessor: 'date_of_birth' },
            { Header: 'age', accessor: 'age' },
            { Header: 'country', accessor: 'country' },
            { Header: 'phone', accessor: 'phone' },
        ],
        []
    );

    const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.
        console.log("pageindex>>>", pageIndex);
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
                const getData = makeData2(startRow, endRow);
                setData(getData.data);

                // Your server could send back total page count.
                // For now we'll just fake it, too
                setPageCount(Math.ceil(getData.length / pageSize));

                setLoading(false);
            }
        }, 1000);
    }, []);


    const handleSort = useCallback(sortBy => {}, []);

    if (loading) return <div>loading...</div>;
    return (
        <div>
            <Table
                data={data}
                columns={columns}

                onSort={handleSort}
                fetchData={fetchData}
                loading={loading}
                pageCount={pageCount}

                // tableRef={tableRef}
                pageSizeOptions = {[10,20, 40]}


                setPage={setPage}
                setPerPage={setPerPage}
                currentpage={page}
                perPage={perPage}
                // totalPage={schools?.data.totalPages}

                classNames="-striped -highlight"
            />
            <br />
            <Tips />
        </div>
    );
}
