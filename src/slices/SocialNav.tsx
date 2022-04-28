import { BgMode, endpoint, ModxSlice } from '../utils/modx';

import React from 'react';
import { assignTo, SocialNav, ThemeMods } from '@blateral/b.kit';
import { LinkProps } from '@blateral/b.kit/lib/components/typography/Link';

interface SocialNavItem {
    link: LinkProps;
    icon?: string;
}

export interface SocialNavSliceType extends ModxSlice<'SocialNav', SocialNavItem> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: Omit<BgMode, 'splitted'>;
    bgColor?: string;

    theme?: ThemeMods;
}
export const SocialNavSlice: React.FC<SocialNavSliceType> = ({
    bgMode,
    bgColor,
    items,
    anchorId,
    theme,
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

    const svgRegex = new RegExp(/.svg/gi);
    return (
        <SocialNav
            theme={sliceTheme}
            anchorId={anchorId || ''}
            bgMode={bgMode as 'inverted' | 'full' | undefined}
            socials={
                items
                    ? items
                          .filter((item) => item?.icon && item?.link?.href)
                          .map((item) => {
                              const iconpath = item?.icon?.match(svgRegex)
                                  ? `${endpoint}${item.icon}`
                                  : item.icon;

                              return {
                                  link: item.link,
                                  icon: <img src={iconpath}></img>,
                              };
                          })
                    : []
            }
        />
    );
};
