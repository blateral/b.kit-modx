import { ModxSlice } from '../utils/modx';
import React from 'react';
import { Theme, Timeline } from '@blateral/b.kit';

interface TimelineItems {
    label?: string;
    title?: string;
    text?: string;
}

export interface TimelineSliceType
    extends ModxSlice<'Timeline', TimelineItems> {
    isActive?: boolean;

    theme?: Theme;
}

export const TimelineSlice: React.FC<TimelineSliceType> = ({
    items,
    theme,
}) => {
    return <Timeline theme={theme} items={items} />;
};
