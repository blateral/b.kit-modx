import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { NewsTable } from '@blateral/b.kit/sections';
import { HeadlineTag } from '@blateral/b.kit/types/components/typography/Heading';
import { TableProps } from '@blateral/b.kit/types/components/blocks/TableBlock';
import { ModxSlice } from 'utils/modx';

export interface NewsTableSliceType extends ModxSlice<'NewsTable'> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    title?: string;
    titleAs?: HeadlineTag;
    sliceRows?: Array<{ cols: string[] }>;
    as_table_header?: boolean;
    bgColor?: string;
    theme?: ThemeMods;
}

export const NewsTableSlice: React.FC<NewsTableSliceType> = ({
    title,
    sliceRows,
    as_table_header,
    bgMode,
    bgColor,
    theme,
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

    const tableItems = createTableItems(sliceRows, !!as_table_header, title);

    return (
        <NewsTable theme={sliceTheme} bgMode={bgMode} tableItems={tableItems} />
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
    ] as TableProps[];
}
