import { NewsTable } from '@blateral/b.kit';
import React from 'react';
import { TableProps } from '@blateral/b.kit/lib/components/sections/Table';
import { ModxSlice } from 'utils/modx';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';

export interface NewsTableSliceType extends ModxSlice<'NewsTable'> {
    primary: {
        isActive?: boolean;
        title?: string;
        titleAs?: HeadlineTag;
        table?: string;
        as_table_header?: boolean;
    };
}

export const NewsTableSlice: React.FC<NewsTableSliceType> = ({
    primary: { title, titleAs, table, as_table_header },
}) => {
    // get background mode

    return (
        <NewsTable
            tableItems={
                table ? [createTableItem(table, title, as_table_header)] : []
            }
        />
    );
};

function createTableItem(
    tableItem: string,
    tableTitle?: string,
    firstRowAsHeadings?: boolean
): TableProps {
    if (!tableItem) return { row: [], rowTitle: [] };

    const { tableHeaders, sliceRows } = convertCsvToTable(
        tableItem,
        firstRowAsHeadings
    );

    return {
        tableTitle: tableTitle,
        rowTitle: tableHeaders || [],
        row: sliceRows || [],
    };
}

function convertCsvToTable(tableCsv: string, firstRowAsHeading = false) {
    const rows = tableCsv.split('\n');

    const sliceRows = rows.map((row) => {
        const columns = row.split(',');
        return {
            cols: columns,
        };
    });

    if (firstRowAsHeading) {
        const tableHeaders = rows[0].split(',');
        sliceRows.shift();

        return { tableHeaders, sliceRows };
    }

    return { sliceRows };
}
