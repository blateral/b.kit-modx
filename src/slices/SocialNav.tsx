import { BgMode, ModxSlice, SocialMediaItem } from '../utils/modx';

import React from 'react';
import { assignTo, SocialNav, Theme } from '@blateral/b.kit';

export interface SocialNavSliceType
    extends ModxSlice<'SocialNav', SocialMediaItem> {
    isActive?: boolean;
    bgMode?: Omit<BgMode, 'full' | 'splitted'>;
    bgColor?: string;

    theme?: Theme;
}
export const SocialNavSlice: React.FC<SocialNavSliceType> = ({
    bgMode,
    bgColor,
    items,

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

    return (
        <SocialNav
            theme={sliceTheme}
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
