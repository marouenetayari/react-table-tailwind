import React, { useState } from "react";
import makeData from "./makeData";
import TableServerSide from './Table'

const serverData = makeData(10000);

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

    const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy }) => {
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
        }, 1000);
    }, []);

    return (
        <TableServerSide
            columns={columns}
            data={data}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
            manual // informs React Table that you'll be handling sorting and pagination server-side
        />
    );
}
