import React, { useState, useCallback } from "react";
import makeData from "./makeData";
import { Table } from './Table'

const serverData = makeData(20);

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [pageCount, setPageCount] = React.useState(0);
    const fetchIdRef = React.useRef(0);
    const sortIdRef = React.useRef(0);

    const columns = React.useMemo(
        () => [
            {
                Header: "First Name",
                accessor: "firstName"
            },
            {
                Header: "Last Name",
                accessor: "lastName"
            },
            {
                Header: "Age",
                accessor: "age"
            }
        ],
        []
    );

    const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.

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
                setData(serverData.slice(startRow, endRow));

                // Your server could send back total page count.
                // For now we'll just fake it, too
                setPageCount(Math.ceil(serverData.length / pageSize));

                setLoading(false);
            }
        }, 1000);
    }, []);

    const handleSort = useCallback(({ sortBy, pageIndex, pageSize }) => {
        // Give this sort an ID
        const sortId = ++sortIdRef.current;
        // Set the loading state
        setLoading(true);

        //simulate remove server sort
        setTimeout(() => {
            // Doing multisort
            if (sortId === sortIdRef.current) {
                let sorted = serverData.slice();
                sorted.sort((a, b) => {
                    for (let i = 0; i < sortBy.length; ++i) {
                        if (a[sortBy[i].id] > b[sortBy[i].id])
                            return sortBy[i].desc ? -1 : 1;
                        if (a[sortBy[i].id] < b[sortBy[i].id])
                            return sortBy[i].desc ? 1 : -1;
                    }
                    return 0;
                });
                const startRow = pageSize * pageIndex;
                const endRow = startRow + pageSize;
                setData(sorted.slice(startRow, endRow));
                console.log(sorted.slice(0, 10));
                setLoading(false);
            }
        }, 200);
    }, []);

    return (
        <Table
            columns={columns}
            data={data}
            onSort={handleSort}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
        />
    );
}

export default App;
