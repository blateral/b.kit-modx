import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { TableProps } from '@blateral/b.kit/types/components/blocks/TableBlock';

import { ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const Table = React.lazy(() => import('imports/_Table'));

export interface TableSliceType extends ModxSlice<'Table'> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;
    anchorId?: string;
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
    anchorId,
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
                sectionBg: {
                    medium: bgColor || '',
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
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
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
