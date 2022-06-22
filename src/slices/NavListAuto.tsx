import { ModxSlice } from 'utils/modx';

import { assignTo, NavList, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import { normalizeAnchorId } from 'utils/mapping';
import { LinkProps } from '@blateral/b.kit/lib/components/typography/Link';

type BgMode = 'full' | 'inverted';

export interface AutoNavItem {
    id: string;
    alias: string;
    label: string;
    description: string;
    link: LinkProps;
}

export interface NavListAutoSliceType extends ModxSlice<'NavListAuto'> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: BgMode;
    bgColor?: string;
    subNavItems?: AutoNavItem[];
    icon?: string;

    customTitleIcon?: (props: {
        isInverted?: boolean | undefined;
    }) => React.ReactNode;
    customIcon?: (props: {
        isInverted?: boolean | undefined;
        icon?: string;
    }) => React.ReactNode;

    theme?: ThemeMods;
}

export const NavListAutoSlice: React.FC<NavListAutoSliceType> = ({
    bgMode,
    anchorId,
    bgColor,
    subNavItems,
    icon,
    customTitleIcon,
    customIcon,
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

    return (
        <NavList
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            customTitleIcon={customTitleIcon}
            items={subNavItems?.map((navItem) => ({
                title: navItem.label,
                link: navItem.link,
                text: navItem.description,
                customIcon:
                    customIcon && icon
                        ? ({ isInverted }) =>
                              customIcon({
                                  isInverted,
                                  icon,
                              })
                        : undefined,
            }))}
        />
    );
};
