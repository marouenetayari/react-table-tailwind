import React, {ReactElement, useEffect} from 'react'
import {Column, usePagination, useSortBy, useTable} from "react-table";

interface TableProps<T extends object> {
    columns: Column<T>[];
    data: T[];

    onSort?:any,
    fetchData?:any,
    loading?:boolean,
    pageCount?: any,
    manual?:any,

    filters?: string[]; // columns names to filter
    filter?: string[]; // Filter text

}

export default function TableServerSide<T extends { id: string }>({
                                                columns,
                                                data,
                                                onSort,
                                                fetchData,
                                                loading,
                                                pageCount: controlledPageCount,
                                                manual,
                                                filters,
                                                filter
                                            }: TableProps<T>): ReactElement {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, sortBy }
    } = useTable<T>(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }, // Pass our hoisted table state
            manualPagination: true, // Tell the usePagination
            // hook that we'll handle our own data fetching
            // This means we'll also have to provide our own
            // pageCount.
            pageCount: controlledPageCount,

            manualSortBy: true,
            autoResetPage: false,
            autoResetSortBy: false,
        },
        useSortBy,
        usePagination
    );

    useEffect(() => {
        fetchData({ pageIndex, pageSize, sortBy });
    }, [sortBy, fetchData, pageIndex, pageSize]);

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render("Header")}
                                {/* Add a sort direction indicator */}
                                <span>
                    {column.isSorted
                        ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                        : ""}
                  </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                );
                            })}
                        </tr>
                    );
                })}
                <tr>
                    {loading ? (
                        // Use our custom loading state to show a loading indicator
                        <td>Loading...</td>
                    ) : (
                        <td>
                            Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                            results
                        </td>
                    )}
                </tr>
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>{" "}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {">"}
                </button>{" "}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {">>"}
                </button>{" "}
                <span>
          Page{" "}
                    <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
                <span>
            | Go to page:{" "}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page);
                        }}
                        max={pageOptions.length}
                        min={0}
                        style={{ width: "100px" }}
                    />
        </span>{" "}
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}
