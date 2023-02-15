import React, { lazy } from 'react';
import { ModxSlice } from 'utils/modx';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { normalizeAnchorId } from 'utils/mapping';
import { LinkProps } from '@blateral/b.kit/types/components/typography/Link';

const NavList = lazy(() => import('imports/NavList'));

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

    customTitleIcon?: (props: {
        isInverted?: boolean | undefined;
    }) => React.ReactNode;
    customIcon?: (props: {
        isInverted?: boolean | undefined;
    }) => React.ReactNode;

    theme?: ThemeMods;
}

export const NavListAutoSlice: React.FC<NavListAutoSliceType> = ({
    bgMode,
    anchorId,
    bgColor,
    subNavItems,
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
                customIcon,
            }))}
        />
    );
};
