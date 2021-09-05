import React from 'react';
import { Table } from '@blateral/b.kit';
import { ModxSlice } from 'utils/modx';

interface TableItem {
    tableTitle?: string;
    sliceRows?: Array<{ cols: string[] }>;
    isInverted?: boolean;
    hasBack?: boolean;
    firstRowTitle?: boolean;
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
            tableItems={createTableItems(items)}
        />
    );
};

function createTableItems(items: TableItem[]) {
    return items?.map((item) => {
        const tableRows = item.sliceRows;
        let firstRowTitle: { cols: string[] } | undefined = undefined;
        if (tableRows && item.firstRowTitle) {
            firstRowTitle = tableRows[0];
            tableRows?.splice(0, 1);
        }

        return {
            rowTitle: firstRowTitle?.cols,
            row: tableRows || [],
            tableTitle: item.tableTitle || '',
            isInverted: item.isInverted,
            hasBack: item.hasBack,
        };
    });
}
