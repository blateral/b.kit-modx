import { QuickNav } from '@blateral/b.kit';

import React from 'react';
import { ModxSlice } from 'utils/modx';

interface QuickNavItem {
    link: string;
    label: string;
}

export interface QuickNavSliceType extends ModxSlice<'QuickNav', QuickNavItem> {
    isActive?: boolean;
    active_link?: string;
}
export const QuickNavSlice: React.FC<QuickNavSliceType> = ({
    active_link,
    items,
}) => {
    return (
        <QuickNav
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
