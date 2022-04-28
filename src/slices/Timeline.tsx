import { ModxSlice } from '../utils/modx';
import React from 'react';
import { assignTo, ThemeMods, Timeline } from '@blateral/b.kit';
import { normalizeAnchorId } from 'utils/mapping';

interface TimelineItems {
    label?: string;
    title?: string;
    text?: string;
}

type BgMode = 'full' | 'inverted';

export interface TimelineSliceType
    extends ModxSlice<'Timeline', TimelineItems> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: BgMode;
    bgColor?: string;

    theme?: ThemeMods;
}

export const TimelineSlice: React.FC<TimelineSliceType> = ({
    items,
    anchorId,
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
        <Timeline
            bgMode={bgMode}
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            items={items}
        />
    );
};
