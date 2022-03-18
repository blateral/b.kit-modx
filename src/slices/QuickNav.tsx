import { assignTo, QuickNav, ThemeMods } from '@blateral/b.kit';

import React from 'react';
import { ModxSlice } from 'utils/modx';

interface QuickNavItem {
    link: string;
    label: string;
}

export interface QuickNavSliceType extends ModxSlice<'QuickNav', QuickNavItem> {
    isActive?: boolean;
    active_link?: string;
    bgMode?: 'inverted';
    bgColor?: string;
    theme?: ThemeMods;
}

export const QuickNavSlice: React.FC<QuickNavSliceType> = ({
    active_link,
    items,
    theme,
    bgMode,
    bgColor,
}) => {
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
        <QuickNav
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
