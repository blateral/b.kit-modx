import { assignTo, NewsTable, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import { BgMode, ModxSlice } from 'utils/modx';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import { TableProps } from '@blateral/b.kit/lib/components/sections/news/NewsTable';

export interface NewsTableSliceType extends ModxSlice<'NewsTable'> {
    isActive?: boolean;
    bgMode?: BgMode;
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

    return (
        <NewsTable
            theme={sliceTheme}
            bgMode={(bgMode as any) || undefined}
            tableItems={
                sliceRows
                    ? [
                          createTableItem(
                              sliceRows,
                              title || '',
                              !!as_table_header
                          ),
                      ]
                    : []
            }
        />
    );
};

function createTableItem(
    item: Array<{ cols: string[] }>,
    title: string,
    withTableHeader: boolean
): TableProps {
    const tableRows = item;
    let firstRowTitle: { cols: string[] } | undefined = undefined;

    if (tableRows && withTableHeader) {
        firstRowTitle = tableRows[0];
        tableRows?.splice(0, 1);
    }

    return {
        rowTitle: firstRowTitle?.cols,
        row: tableRows || [],
        tableTitle: title || '',
    };
}
