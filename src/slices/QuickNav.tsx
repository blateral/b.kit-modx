import { QuickNav } from '@blateral/b.kit';

import React from 'react';
import { ModxSlice } from 'utils/modx';

interface QuickNavItem {
    link: string;
    label: string;
}

export interface QuickNavSliceType extends ModxSlice<'QuickNav', QuickNavItem> {
    primary: {
        active_link?: string;
    };
}
export const QuickNavSlice: React.FC<QuickNavSliceType> = ({
    primary: { active_link },
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
