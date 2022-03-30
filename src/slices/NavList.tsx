import { ModxSlice } from 'utils/modx';

import { assignTo, NavList, ThemeMods } from '@blateral/b.kit';
import React from 'react';

type BgMode = 'full' | 'inverted';

interface NavListItems {
    title?: string;
    text?: string;
    link?: {
        href?: string;
        isExternal?: boolean;
    };
}

export interface NavListSliceType extends ModxSlice<'NavList', NavListItems> {
    isActive?: boolean;

    bgMode?: BgMode;
    bgColor?: string;

    customTitleIcon?:
        | ((props: { isInverted?: boolean | undefined }) => React.ReactNode)
        | undefined;
    customIcon?:
        | ((props: { isInverted?: boolean | undefined }) => React.ReactNode)
        | undefined;

    theme?: ThemeMods;
}

export const NavListSlice: React.FC<NavListSliceType> = ({
    bgMode,
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
                mono: {
                    light: bgColor || '',
                },
            },
        },
        theme
    );

    return (
        <NavList
            theme={sliceTheme}
            bgMode={bgMode}
            customIcon={customIcon}
            customTitleIcon={customTitleIcon}
            items={items
                .filter((navitem) => navitem.title && navitem.link?.href)
                .map((navitem) => {
                    return {
                        title: navitem.title,
                        text: navitem.text,
                        link: navitem.link,
                    };
                })}
        />
    );
};