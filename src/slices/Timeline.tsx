import { ModxSlice } from '../utils/modx';
import React from 'react';
import { assignTo, ThemeMods, Timeline } from '@blateral/b.kit';

interface TimelineItems {
    label?: string;
    title?: string;
    text?: string;
}

type BgMode = 'full' | 'inverted';

export interface TimelineSliceType
    extends ModxSlice<'Timeline', TimelineItems> {
    isActive?: boolean;

    bgMode?: BgMode;
    bgColor?: string;

    theme?: ThemeMods;
}

export const TimelineSlice: React.FC<TimelineSliceType> = ({
    items,
    bgMode,
    bgColor,
    theme,
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

    return <Timeline bgMode={bgMode} theme={sliceTheme} items={items} />;
};
