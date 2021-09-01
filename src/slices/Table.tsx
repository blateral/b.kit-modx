import React from 'react';
import { Table } from '@blateral/b.kit';
import { ModxSlice } from 'utils/modx';

interface TableItem {
    tableTitle?: string;
    sliceRows?: Array<{cols: string[]}>;
}


export interface TableSliceType extends ModxSlice<'Table', TableItem> {
    isActive?: boolean;
    bgMode?: string;

    primary_label?: string;
    secondary_label?: string;
    primary_link?: string;
    secondary_link?: string;
}

export const TableSlice: React.FC<TableSliceType> = ({ bgMode, items }) => {
    return (
        <Table
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            tableItems={items?.map(item=>{
                return {
                    row: item.sliceRows as any,
                    tableTitle: item.tableTitle || ""
                }
            })}
        />
    );
};

// function createTableItems(tableItems: TableItem[]): TableProps[] {
//     console.log('TABLE ITEMS', tableItems);
//     return tableItems
//         .filter((item) => item.table && item.table.length > 0)
//         .map((item) => {
//             const { tableHeaders, sliceRows } = convertCsvToTable(item.table!);

//             return {
//                 tableTitle: item.tableTitle || '',
//                 rowTitle: tableHeaders || [],
//                 row: sliceRows || [],
//             };
//         });
// }

// function convertCsvToTable(tableCsv: string) {
//     const rows = tableCsv.split('\n');
//     const tableHeaders = rows[0].split(',');

//     const sliceRows = rows.map((row) => {
//         const columns = row.split(',');
//         return {
//             cols: columns,
//         };
//     });

//     sliceRows.shift();

//     return { tableHeaders, sliceRows };
// }
