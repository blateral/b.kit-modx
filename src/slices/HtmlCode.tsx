import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';

import { ModxSlice } from '../utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const HtmlCode = React.lazy(() => import('imports/_HtmlCode'));

export interface HtmlCodeSliceType extends ModxSlice<'HtmlCode'> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: 'full' | 'inverted';
    bgColor?: string;
    theme?: ThemeMods;

    html?: string;
}

export const HtmlCodeSlice: React.FC<HtmlCodeSliceType> = ({
    theme,
    anchorId,
    bgMode,
    bgColor,
    html,
}) => {
    if (!html) return null;

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
        <HtmlCode
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            html={html}
        />
    );
};
