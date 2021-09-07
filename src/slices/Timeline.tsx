import { ModxSlice } from '../utils/modx';
import React from 'react';
import { Timeline } from '@blateral/b.kit';

interface TimelineItems {
    label?: string;
    title?: string;
    text?: string;
}

export interface TimelineSliceType
    extends ModxSlice<'Timeline', TimelineItems> {
    isActive?: boolean;
}

export const TimelineSlice: React.FC<TimelineSliceType> = ({ items }) => {
    return <Timeline items={items} />;
};
