import { BgMode, ModxSlice, SocialMediaItem } from '../utils/modx';

import React from 'react';
import { SocialNav } from '@blateral/b.kit';

export interface SocialNavSliceType
    extends ModxSlice<'SocialNav', SocialMediaItem> {
    isActive?: boolean;
    bgMode?: Omit<BgMode, 'full' | 'splitted'>;
}
export const SocialNavSlice: React.FC<SocialNavSliceType> = ({
    bgMode,
    items,
}) => {
    return (
        <SocialNav
            bgMode={bgMode && bgMode === 'transparent' ? undefined : 'inverted'}
            socials={items
                .filter((item) => item?.link && item?.icon?.small)
                .map((item) => {
                    return {
                        href: item.link || '',
                        icon: <img src={item?.icon?.small || ''}></img>,
                    };
                })}
        />
    );
};
