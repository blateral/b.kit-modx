import { ModxSlice } from 'utils/modx';

import { assignTo, NavList, ThemeMods } from '@blateral/b.kit';
import React from 'react';

type BgMode = 'full' | 'inverted';

interface NavListItems {
    icon?: string;

    title?: string;
    text?: string;
    link?: {
        href?: string;
        isExternal?: boolean;
    };
}

export interface NavListSliceType extends ModxSlice<'NavList', NavListItems> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    bgMode?: BgMode;
    bgColor?: string;
    customTitleIcon?: (props: {
        isInverted?: boolean | undefined;
    }) => React.ReactNode;
    customIcon?: (props: {
        isInverted?: boolean | undefined;
        icon?: string;
    }) => React.ReactNode;

    theme?: ThemeMods;
}

export const NavListSlice: React.FC<NavListSliceType> = ({
    bgMode,
    anchor,
    bgColor,
    customTitleIcon,
    customIcon,
    items,
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
            anchorId={anchor?.id || ''}
            bgMode={bgMode}
            customTitleIcon={customTitleIcon}
            items={items
                .filter((navitem) => navitem.title && navitem.link?.href)
                .map((navitem) => {
                    return {
                        title: navitem.title,
                        text: navitem.text,
                        link: navitem.link,
                        customIcon:
                            customIcon && navitem.icon
                                ? ({ isInverted }) =>
                                      customIcon({
                                          isInverted,
                                          icon: navitem.icon,
                                      })
                                : undefined,
                    };
                })}
        />
    );
};
