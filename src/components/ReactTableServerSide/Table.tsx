import React, {ReactElement, useEffect} from 'react'
// import { MdKeyboardArrowUp, MdKeyboardArrowDown, } from 'react-icons/md'
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md"
import {Column, usePagination, useSortBy, useTable} from "react-table";
import { styles } from './TableStyles'

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
    handleRowClick?: any

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
                                                filter,
                                                handleRowClick
                                            }: TableProps<T>): ReactElement {

    const defaultColumn = React.useMemo(
        () => ({
            minWidth: 30,
            width: 150,
            maxWidth: 400,
        }),
        []
    )


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
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
            // autoResetPage: false,
            // autoResetSortBy: false,
            autoResetHiddenColumns: true,
            autoResetSortBy:true
            // defaultColumn
        },
        useSortBy,
        usePagination
    );

    useEffect(() => {
        fetchData({ pageIndex, pageSize, sortBy });
    }, [sortBy, fetchData, pageIndex, pageSize]);

    return (
        <>
            <table className={styles.tableTable} {...getTableProps()}>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr className={styles.tableHeadRow} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            // Add the sorting props to control sorting. For this example
                            // we can add them into the header props
                            <th className={styles.tableHeadCell}
                                {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render("Header")}
                                {/* Add a sort direction indicator */}
                                {
                                    (!column.disableSortBy)
                                    ? (column.isSorted)
                                        ? column.isSortedDesc
                                            ? <span className={styles.tableSortLabel}><MdArrowDropUp className={'text-lg opacity-50'}/><MdArrowDropDown className={'-mt-3 text-lg'}/></span>
                                            : <span className={styles.tableSortLabel}><MdArrowDropUp className={'text-lg'}/><MdArrowDropDown className={'-mt-3 text-lg opacity-50'}/></span>
                                        : <span className={styles.tableSortLabel}><MdArrowDropUp className={'text-lg opacity-50'}/><MdArrowDropDown className={'-mt-3 text-lg opacity-50'}/></span>
                                    : null
                                }
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody className={styles.tableBody} {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr className={styles.tableRow} {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                            {row.cells.map((cell) => {
                                return (
                                    <td className={styles.tableCell} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                );
                            })}
                        </tr>
                    );
                })}
                <tr>
                    {loading ? (
                        // Use our custom loading state to show a loading indicator
                        <td colSpan={100}>Chargement...</td>
                    ) : (
                        <td colSpan={100}>
                            Afficher {page.length} sur ~ {controlledPageCount * pageSize}{" "} résultats
                        </td>
                    )}
                </tr>
                </tbody>
                {/*<tfoot>*/}
                {/*    <tr>*/}
                {/*        */}
                {/*    </tr>*/}
                {/*</tfoot>*/}
            </table>
            <div className="w-full left mt-4 p-2" >
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
                <span>Page{" "}<strong>{pageIndex + 1} of {pageOptions.length}</strong>{" "}</span>
                <span> | Go to page:{" "}
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
                </span>
                {" "}
                <select className={"float-right p-1 border-2 border-gray-900"}
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Afficher {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}
