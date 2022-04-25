import { assignTo, QuickNav, ThemeMods } from '@blateral/b.kit';

import React from 'react';
import { ModxSlice } from 'utils/modx';

interface QuickNavItem {
    link: string;
    label: string;
}

export interface QuickNavSliceType extends ModxSlice<'QuickNav', QuickNavItem> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    active_link?: string;
    bgMode?: 'inverted';
    bgColor?: string;
    theme?: ThemeMods;
}

export const QuickNavSlice: React.FC<QuickNavSliceType> = ({
    active_link,
    anchor,
    items,
    theme,
    bgMode,
    bgColor,
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
        <QuickNav
            anchorId={anchor?.id || ''}
            bgMode={bgMode}
            theme={sliceTheme}
            navItems={items?.map((item) => {
                return {
                    link: item.link || '',
                    label: item.label || '',
                };
            })}
            activeNavItem={active_link || ''}
        />
    );
};
