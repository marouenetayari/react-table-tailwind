import React, {createRef, ReactElement, useEffect, useMemo} from 'react'
// import { MdKeyboardArrowUp, MdKeyboardArrowDown, } from 'react-icons/md'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.css';
import {Column, useTable} from "react-table";
import {styles} from './TableStyles'

type totalRowDataType = {
    rowStyle: string,
    colStyle: string,
    data: any[]
}

interface TableProps<T extends object> {
    tableRef: any
    columns: Column<T>[]
    data?: T[]
    fetchData?: any
    handleRowClick?: any
    totalRowData?: totalRowDataType
}

export default function BasicTable<T extends { id: string }>(props: TableProps<T>): ReactElement {

    const {
        tableRef,
        columns,
        // data,
        fetchData,
        handleRowClick,
        totalRowData = {rowStyle: '', colStyle: '', data: []},
    } = props;

    console.log(props.data)
    const data = useMemo(() => props.data, [props.data]);
    console.log(data)
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<T>(
        // @ts-ignore
        {
            columns,
            data,
            }
        );

    useEffect(() => {
        console.log('fetch Data')
        fetchData();
    }, [fetchData]);

    return (
        <React.Fragment>
            <SimpleBar autoHide={true}>
                <table className={styles.tableTable} {...getTableProps()} ref={tableRef}>
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr className={styles.tableHeadRow} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th className={styles.tableHeadCell}
                                    {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody className={styles.tableBody} {...getTableBodyProps()}>
                    {   console.log(rows)}
                    {
                        rows.map((row:any, i) => {
                        console.log(row)
                        prepareRow(row);
                        return (
                            <tr className={styles.tableRow} {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                                {row.cells.map((cell:any) => {
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
                    </tfoot>
                </table>
            </SimpleBar>
        </React.Fragment>

    );
}
