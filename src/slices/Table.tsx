import React from 'react';
import { assignTo, Table, Theme } from '@blateral/b.kit';
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
    bgColor?: string;

    primary_label?: string;
    secondary_label?: string;
    primary_link?: string;
    secondary_link?: string;

    theme?: Theme;
}

export const TableSlice: React.FC<TableSliceType> = ({
    bgMode,
    bgColor,
    items,
    theme,
}) => {
    // merging cms and component theme settings
    const sliceTheme = assignTo(
        {
            colors: {
                mono: {
                    light: bgColor || '',
                },
            },
        },
        theme
    );

    return (
        <Table
            theme={sliceTheme}
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
