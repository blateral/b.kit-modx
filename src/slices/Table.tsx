import React from 'react';
import { assignTo, Table, Theme } from '@blateral/b.kit';
import { ModxSlice } from 'utils/modx';


export interface TableSliceType extends ModxSlice<'Table'> {
    isActive?: boolean;
    bgMode?: string;
    bgColor?: string;

    tableTitle?: string;
    sliceRows?: Array<{ cols: string[] }>;
    hasFirstRowTitle?: boolean;

    primary_label?: string;
    secondary_label?: string;
    primary_link?: string;
    secondary_link?: string;

    theme?: Theme;
}

export const TableSlice: React.FC<TableSliceType> = ({
    bgMode,
    bgColor,
    theme,
    tableTitle,
    sliceRows,
    hasFirstRowTitle,
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

    const tableItems = createTableItems(
        sliceRows,
        hasFirstRowTitle,
        tableTitle
    );

    console.log(tableItems);

    return (
        <Table
            theme={sliceTheme}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            tableItems={tableItems}
        />
    );
};

function createTableItems(
    sliceRows?: Array<{ cols: string[] }>,
    hasFirstRowTitle?: boolean,
    tableTitle?: string
) {
    const rowData = JSON.parse(JSON.stringify(sliceRows));
    let rowTitle: { cols: string[] } | undefined = undefined;
    if (rowData && hasFirstRowTitle) {
        rowTitle = rowData.shift();
    }

    return [
        {
            tableTitle: tableTitle || '',
            rowTitle: hasFirstRowTitle ? rowTitle?.cols : undefined,
            row: rowData || [],
        },
    ];
}
