import React, {createRef, useRef, useState} from "react";
import makeData from "./makeData";
import TableServerSide from './Table'
import {styles} from "./TableStyles";
import {MdAddCircleOutline, MdDelete, MdLastPage, MdSave} from "react-icons/md";

const serverData = makeData(5);
const endPoitUrl = 'https://api.instantwebtools.net/v1/passenger'
/**
 * Call EndPoint handler
 * @param pageSize
 * @param pageIndex
 * @param sortBy
 */
const handleEndPoit = (pageSize = 20, pageIndex = 0, sortBy = '[]') => {
    fetch(`${endPoitUrl}?page=${pageIndex}&size=${pageSize}`)
        .then(response => response.json())
        .then(data => console.log(data)) // here I get 500000 items
}

export default function AppServerSide() {

    // const [addRowData, setAddRowData] = useState([addNewRow]);
    const [addRowData, setAddRowData] = useState([]);
    const [data, setData] = useState([]);
    const [totalRowData, setTotalRowData]= useState(undefined);
    const [loading, setLoading] = React.useState(false);
    const [pageCount, setPageCount] = React.useState(0);
    const fetchIdRef = React.useRef(0);
    const tableRef = useRef();
    const [rowdata, setRowData] = useState([]);


    // handle input change
    // const handleInputChange = (e:any, index:number) => {
    //     const { name, value } = e.target;
    //     const list = [...inputList];
    //     list[index][name] = value;
    //     setInputList(list);
    // };

    const handleChange = (event: any, key: number) =>  {
        const { name, value } = event.target
        const addRowData = this.state.addRowData[key]
        addRowData[name] = value
        this.setScale(addRowData)
    }

    /**
     * Add new row template
     */
    const addNewRow = (rows:any, key:number) => {

        return (
                <tr className={styles.addRowTR}>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'text'} name={'firstName'} /></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'text'} name={'lastName'} /></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'number'} name={'age'} /></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'email'}/></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'number'}/></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'month'}/></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'range'}/></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'search'}/></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'tel'}/></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'time'}/></td>
                    <td className={styles.addRowTD}><input className={styles.addRowInput} type={'url'}/></td>
                    <td className={styles.addRowTD}>
                        <button onClick={() => onRowDelte} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-2 rounded mt-2">
                            <MdDelete className={'text-xl'} />
                        </button>
                    </td>
                </tr>
            )
    };

    /**
     * Add new row Talbe
     */
    const onAddRowClick = () => {
        const data = {...addRowData}

        const key = Object.keys(data).length
        data[key] = addNewRow(data, (key > 0) ? key-1 : 0)
        setAddRowData(data);
    };

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
                    Footer: (<span>
                            <strong>Longest:</strong>{" "}
                        </span>),
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
                },
                {
                    Width: 200,
                    Header: "Action",
                    id: 'edit',
                    accessor: '[col_5]',
                    disableSortBy: true,
                    Cell: () => (
                        <button onClick={() => onRowDelte} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-2 rounded mt-2">
                            <MdDelete className={'text-xl'} />
                        </button>
                    )

                    // render: ({ row }) => (<button onClick={(e) => this.handleButtonClick(e, row)}>Click Me</button>)
                },
            ]
,[])

    /**
     * OnRowClick Function
     * @param row
     */
    const handleRowClick = ((row: any) => { console.log(row) })

    /**
     * Fetch Data
     */
    const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, withPagination }) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.


        console.log(`withPagination : ${withPagination} page size : ${pageSize}, pageIndex : ${pageIndex} et SortedBy : ${sortBy}`)
        // handleEndPoit(pageSize, pageIndex, sortBy)

        // update totalRowData
        setTotalRowData(   {
            rowStyle: 'bg-blue-300 text-sm font-bold',
            colStyle: 'p-2',
            data: [<span className={'text-white'}>Total</span>, '-', '-', '-', '-', '-', '1000€', '500€', '800€', '1200€', '300€']
        });

        // Give this fetch an ID
        const fetchId = ++fetchIdRef.current;

        // Set the loading state
        setLoading(true);

        // We'll even set a delay to simulate a server here
        setTimeout(() => {
            // Only update the data if this is the latest fetch
            if (fetchId === fetchIdRef.current) {
                const startRow = (withPagination) ? pageSize * pageIndex : 0;
                const endRow = (withPagination) ? startRow + pageSize : serverData.length;
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
        console.log(data)
    }, []);

    const onRowDelte = () => {
        console.log("Row delete");
    };

    const onSaveData = async () => {
        console.log("Save data");
        setAddRowData([]);
    };

    return (
        <React.Fragment>
            <TableServerSide
                tableRef={tableRef}
                columns={columns}
                data={data}
                fetchData={fetchData}
                loading={loading}

                onAddRowClick={onAddRowClick}
                onSaveData={onSaveData}
                addRowData={addRowData}
                onRowDelte={onRowDelte}

                pageCount={pageCount}

                withPagination={true}
                // totalRowData={totalRowData}

                rowPerPage={[25, 50, 100]}
                handleRowClick={handleRowClick}
                manual // informs React Table that you'll be handling sorting and pagination server-side
            />
        </React.Fragment>
    );
}
