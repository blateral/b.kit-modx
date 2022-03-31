import { assignTo, Quote, ThemeMods } from '@blateral/b.kit';

import React from 'react';
import { ModxSlice } from '../utils/modx';

export interface QuoteSliceType extends ModxSlice<'Quote'> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
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
    anchor,
    bgMode,
    bgColor,
    text,
    source,
    citeUrl,
}) => {
    if (!text) return null;

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
        <Quote
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
            bgMode={bgMode}
            text={text}
            source={source}
            citeUrl={citeUrl}
        />
    );
};
