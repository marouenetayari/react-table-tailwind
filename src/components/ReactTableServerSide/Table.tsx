import React, {createRef, ReactElement, useEffect} from 'react'
// import { MdKeyboardArrowUp, MdKeyboardArrowDown, } from 'react-icons/md'
import { MdArrowDropUp, MdArrowDropDown, MdFirstPage, MdLastPage, MdChevronLeft, MdChevronRight } from "react-icons/md"
import {Column, usePagination, useSortBy, useTable} from "react-table";
import { styles } from './TableStyles'

type totalRowDataType = {
    rowStyle: string,
    colStyle: string,
    data: any[]
}

interface TableProps<T extends object> {
    tableRef: any;
    columns: Column<T>[];
    data?: T[];

    fetchData?:any,
    loading?:boolean,
    withPagination?:boolean,
    pageCount?: any,
    rowPerPage?: number[],
    totalRowData?: totalRowDataType,
    handleRowClick?: any,
    manual?:any,
}

export default function TableServerSide<T extends { id: string }>(props: TableProps<T>): ReactElement {

    const {
        tableRef,
        columns,
        data,
        fetchData,
        loading,
        withPagination = true,
        pageCount: controlledPageCount,
        rowPerPage = [10, 20, 30, 40, 50],
        handleRowClick,
        totalRowData = {rowStyle: '', colStyle: '', data: []},
    } = props;

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
            // autoResetPage: false,
            // autoResetSortBy: false,
            autoResetHiddenColumns: true,
            autoResetSortBy:true,
        },
        useSortBy,
        usePagination
    );

    useEffect(() => {
        fetchData({ pageIndex, pageSize, sortBy, withPagination });
    }, [sortBy, fetchData, pageIndex, pageSize]);

    return (
        <>
            <table className={styles.tableTable} {...getTableProps()} ref={tableRef}>
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
                                            ? <span className={styles.tableSortLabel}><MdArrowDropUp
                                                className={'text-lg opacity-50'}/><MdArrowDropDown
                                                className={'-mt-3 text-lg'}/></span>
                                            : <span className={styles.tableSortLabel}><MdArrowDropUp
                                                className={'text-lg'}/><MdArrowDropDown
                                                className={'-mt-3 text-lg opacity-50'}/></span>
                                        : <span className={styles.tableSortLabel}><MdArrowDropUp
                                            className={'text-lg opacity-50'}/><MdArrowDropDown
                                            className={'-mt-3 text-lg opacity-50'}/></span>
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
                </tbody>
                <tfoot>
                {
                    (totalRowData.data.length > 0)
                        ? (<tr className={totalRowData.rowStyle}>
                            {
                                totalRowData.data.map((footerCell: any, key: number) => {
                                    return <td key={key} className={totalRowData.colStyle}>{footerCell}</td>
                                })
                            }
                        </tr>)
                        : null
                }
                <tr>
                    {/*Use our custom loading state to show a loading indicator*/}
                    <td colSpan={100} className={'w-full bg-blue-50 text-sm p-1'}>
                        {
                            loading ? (
                                <strong>`Chargement...`</strong>
                            ) : (<span>Afficher <strong>{page.length} sur {controlledPageCount * pageSize}</strong> résultats</span>)
                        }
                    </td>
                </tr>
                </tfoot>
            </table>
            {
                withPagination
                    ? <div className={styles.paginationBox}>
                        <div className={styles.paginationInfo}>
                            <span>Page{" "}<strong>{pageIndex + 1} sur {pageOptions.length}</strong>{" "}</span>
                            <span> | Aller à la page :{" "}
                                <input type="number" defaultValue={pageIndex + 1}
                                       onChange={(e) => {
                                           const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                           gotoPage(page);
                                       }}
                                       max={pageOptions.length} min={0}
                                       className={styles.paginationIndexPage} /*style={{ width: "100px" }}*/
                                />
                    </span>
                        </div>
                        <div className={styles.paginationNavigation}>
                            <div className="flex text-gray-700">
                                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}
                                        className={styles.buttonsStyle}>
                                    <MdFirstPage className={styles.iconSize}/>
                                </button>
                                <button onClick={() => previousPage()} disabled={!canPreviousPage}
                                        className={styles.buttonsStyle}>
                                    <MdChevronLeft className={styles.iconSize}/>
                                </button>
                                <button onClick={() => nextPage()} disabled={!canNextPage}
                                        className={styles.buttonsStyle}>
                                    <MdChevronRight className={styles.iconSize}/>
                                </button>
                                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}
                                        className={styles.buttonsStyle}>
                                    <MdLastPage className={styles.iconSize}/>
                                </button>
                            </div>
                        </div>
                        <div className={styles.paginationNumberRows}>
                            <select className={styles.paginationNumberRowsSelect}
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                    }}>
                                {(rowPerPage).map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Afficher {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    : null
            }
        </>
    );
}
