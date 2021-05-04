import React, {CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect } from "react";
import { Info, ChevronDown, ChevronUp } from "react-feather";
import cx from "classnames";
import {
  Cell,
  CellProps,
  ColumnInstance,
  FilterProps,
  HeaderGroup,
  HeaderProps,
  Hooks,
  Meta,
  Row,
  TableInstance,
  TableOptions,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable
} from "react-table";

// Tailwind styles
import {tableTable, tableHeadRow, tableHeadCell, tableRow, tableCell, tableBody } from "./utils/TableStyles";
import Button from '../../Button/src';
// import { TableToolbar } from "./TableToolbar";
// import { TablePagination } from "./TablePagination";
// import Button from "../Button/Button";

export interface TableProperties<T extends Record<string, unknown>>
  extends TableOptions<T> {
  name: string;
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler;
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler;
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler;
  onClick?: (row: Row<T>) => void;
}

const getStyles = (props: any, disableResizing = false, align = "left") => [
  props,
  {
    style: {
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      display: "flex"
    }
  }
];

const actionHook = (hooks: Hooks<any>) => {
  hooks.allColumns.push((columns) => [
      ...columns,
  // Let's make a column for action
    {
      id: "_selector",
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 80,
      width: 80,
      maxWidth: 80,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      // Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
      //   <HeaderCheckbox className={styleHeaderCheckbox} {...getToggleAllRowsSelectedProps()} />
      // ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }: CellProps<any>) => (
          <Button className={'rounded bg-gray-600 rounded w-14 h-auto text-center'} {...row.getToggleRowSelectedProps()}>
              <Info className={'text-sm color-red-500'}/>
          </Button>
      )
    },
  ]);
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    const selectionGroupHeader = headerGroups[0].headers[0];
    selectionGroupHeader.canResize = false;
  });
};

const headerProps = <T extends Record<string, unknown>>(
  props: any,
  { column }: Meta<T, { column: HeaderGroup<T> }>
) => getStyles(props, column && column.disableResizing, column && column.align);

const cellProps = <T extends Record<string, unknown>>(
  props: any,
  { cell }: Meta<T, { cell: Cell<T> }>
) =>
  getStyles(
    props,
    cell.column && cell.column.disableResizing,
    cell.column && cell.column.align
  );

const defaultColumn = {
  // Filter: DefaultColumnFilter,
  // Cell: TooltipCell,
  // Header: DefaultHeader,
  // When using the useFlexLayout:
  minWidth: 40, // minWidth is only used as a limit for resizing
  // width: 80, // width is used for both the flex-basis and flex-grow
  maxWidth: 150 // maxWidth is only used as a limit for resizing
};

const hooks = [
    useSortBy,
    useFlexLayout,
    usePagination,
    useResizeColumns,
    useRowSelect,
    actionHook
];

export function Table<T extends Record<string, unknown>>(
  props: PropsWithChildren<TableProperties<T>>
): ReactElement {
  const { columns, onAdd, onDelete, onEdit, onClick } = props;
  const instance = useTable<T>(
    {
      ...props,
      columns,
      defaultColumn,
    },
    ...hooks
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    page,
    prepareRow,
  } = instance;

  const cellClickHandler = (cell: Cell<T>) => () => {
    onClick && cell.column.id !== "_selector" && onClick(cell.row);
  };

  return (
    <>
      {/*<TableToolbar instance={instance} {...{ onAdd, onDelete, onEdit }} />*/}
      <div className={tableTable} {...getTableProps()}>
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className={tableHeadRow} >
              {headerGroup.headers.map((column) => {
                const style = {textAlign: column.align ? column.align : "left "} as CSSProperties;
                return (
                  <div {...column.getHeaderProps(headerProps)} className={ tableHeadCell}>
                    {column.canSort ? (
                      <div {...column.getSortByToggleProps()} style={style}>
                          <span className={'inline-flex cursor-pointer'}>
                            {column.render("Header")}
                                {column.isSorted
                                    ? column.isSortedDesc
                                        ? <ChevronDown className={'w-4 ml-1'}/>
                                        : <ChevronUp className={'w-4 ml-1'}/>
                                    : ''
                                }
                          </span>
                      </div>
                    ) : (
                      <div style={style} className={''}>
                        {column.render("Header")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className={tableBody}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <div
                {...row.getRowProps()}
                className={cx(tableRow, {
                  rowSelected: row.isSelected
                })}
              >
                {row.cells.map((cell) => (
                  <div
                    {...cell.getCellProps(cellProps)}
                    onClick={cellClickHandler(cell)}
                    className={tableCell}
                  >
                  {
                      cell.isPlaceholder ? null : ( cell.render("Cell"))
                  }
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {/*<TablePagination<T> instance={instance} />*/}
    </>
  );
}
