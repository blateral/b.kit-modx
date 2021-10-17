import { BgMode, endpoint, ModxSlice } from '../utils/modx';

import React from 'react';
import { assignTo, SocialNav, Theme } from '@blateral/b.kit';

interface SocialNavItem {
    href?: string;
    icon?: string;
}

export interface SocialNavSliceType
    extends ModxSlice<'SocialNav', SocialNavItem> {
    isActive?: boolean;
    bgMode?: Omit<BgMode, 'splitted'>;
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

    const svgRegex = new RegExp(/.svg/gi);
    return (
        <SocialNav
            theme={sliceTheme}
            bgMode={bgMode as 'inverted' | 'full' | undefined}
            socials={
                items
                    ? items
                          .filter((item) => item?.icon)
                          .map((item) => {
                              const iconpath = item?.icon?.match(svgRegex)
                                  ? `${endpoint}${item.icon}`
                                  : item.icon;

                              console.log(iconpath);
                              return {
                                  href: item.href || '',
                                  icon: <img src={iconpath}></img>,
                              };
                          })
                    : []
            }
        />
    );
};
