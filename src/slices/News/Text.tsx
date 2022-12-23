import { assignTo, NewsText, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import { ModxSlice } from 'utils/modx';

export interface NewsTextSliceType extends ModxSlice<'NewsText'> {
    isActive?: boolean;
    text?: string;
    bgMode?: 'full' | 'inverted';

    bgColor?: string;
    theme?: ThemeMods;
}

export const NewsTextSlice: React.FC<NewsTextSliceType> = ({
    text,
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

    return <NewsText theme={sliceTheme} bgMode={bgMode} text={text || ''} />;
};

export const getNewsTextSearchData = (slice: NewsTextSliceType) => {
    const data: string[] = [];
    if (slice?.text) data.push(slice.text);
    return data;
};
