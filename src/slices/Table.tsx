import React from 'react';
import { assignTo, Table, ThemeMods } from '@blateral/b.kit';
import { ModxSlice } from 'utils/modx';
import { TableProps } from '@blateral/b.kit/lib/components/sections/Table';

export interface TableSliceType extends ModxSlice<'Table'> {
    isActive?: boolean;
    bgMode?: string;
    bgColor?: string;
    anchor?: {
        id?: string;
        label?: string;
    };
    tableTitle?: string;
    sliceRows?: Array<{ cols: string[] }>;
    hasFirstRowTitle?: boolean;
    lastCol?: 'left' | 'right';
    primary_label?: string;
    secondary_label?: string;
    primary_link?: string;
    secondary_link?: string;

    theme?: ThemeMods;
}

export const TableSlice: React.FC<TableSliceType> = ({
    bgMode,
    bgColor,
    anchor,
    theme,
    tableTitle,
    sliceRows,
    hasFirstRowTitle,
    lastCol,
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
        tableTitle,
        lastCol
    );

    return (
        <Table
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
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
    tableTitle?: string,
    lastCol?: 'left' | 'right'
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
            lastCol,
        },
    ] as TableProps[];
}
