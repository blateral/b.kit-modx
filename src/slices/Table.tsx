import React from 'react';
import { Table } from '@blateral/b.kit';
import { TableProps } from '@blateral/b.kit/lib/components/sections/Table';
import { ModxSlice } from 'utils/modx';

interface TableItem {
    table_title?: string;
    table?: string;
}

export interface TableSliceType extends ModxSlice<'Table', TableItem> {
    primary: {
        is_active?: boolean;
        bgMode?: string;

        primary_label?: string;
        secondary_label?: string;
        primary_link?: string;
        secondary_link?: string;
    };
}

export const TableSlice: React.FC<TableSliceType> = ({
    primary: { bgMode },
    items,
}) => {
    const tableData = createTableItems(items);
    return (
        <Table
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            tableItems={tableData}
        />
    );
};

function createTableItems(tableItems: TableItem[]): TableProps[] {
    return tableItems
        .filter((item) => item.table && item.table.length > 0)
        .map((item) => {
            const { tableHeaders, sliceRows } = convertCsvToTable(item.table!);

            return {
                tableTitle: item.table_title || '',
                rowTitle: tableHeaders || [],
                row: sliceRows || [],
            };
        });
}

function convertCsvToTable(tableCsv: string) {
    const rows = tableCsv.split('\n');
    const tableHeaders = rows[0].split(',');

    const sliceRows = rows.map((row) => {
        const columns = row.split(',');
        return {
            cols: columns,
        };
    });

    sliceRows.shift();

    return { tableHeaders, sliceRows };
}
