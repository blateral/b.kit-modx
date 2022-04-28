import { assignTo, Quote, ThemeMods } from '@blateral/b.kit';

import React from 'react';
import { ModxSlice } from '../utils/modx';

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
            anchorId={anchorId || ''}
            bgMode={bgMode}
            text={text}
            source={source}
            citeUrl={citeUrl}
        />
    );
};
