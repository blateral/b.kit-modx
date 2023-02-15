import React, { lazy } from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const Quote = lazy(() => import('imports/Quote'));

export interface QuoteSliceType extends ModxSlice<'Quote'> {
    isActive?: boolean;
    anchorId?: string;
    active_link?: string;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;
    theme?: ThemeMods;

    text?: string;
    source?: string;
    citeUrl?: string;
}

export const QuoteSlice: React.FC<QuoteSliceType> = ({
    theme,
    anchorId,
    bgMode,
    bgColor,
    text,
    source,
    citeUrl,
}) => {
    if (!text) return null;

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
        <Quote
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            text={text}
            source={source}
            citeUrl={citeUrl}
        />
    );
};

export const getQuoteSearchData = (slice: QuoteSliceType): string[] => {
    const data: string[] = [];
    if (slice?.text) data.push(slice.text);
    return data;
};
