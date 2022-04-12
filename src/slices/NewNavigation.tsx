import { NewNavigation, ThemeMods } from '@blateral/b.kit';
import {
    MenuTypeProps,
    NavItem,
} from '@blateral/b.kit/lib/components/sections/navigation/remastered/menu/Menu';

import {
    NavBarStates,
    NavMenuStates,
} from '@blateral/b.kit/lib/components/sections/navigation/remastered/Navigation';
import React from 'react';
import { ModxNavGroup, ModxSlice } from 'utils/modx';

export interface NewNavigationSliceType extends ModxSlice<'Navigation'> {
    clampWidth?: 'content' | 'full';
    navbar?: {
        isStickable?: boolean;
        isCollapsible?: boolean;
        pageFlow?: 'overContent' | 'beforeContent';
        topBg?: string;
        mainBg?: string;
        bottomBg?: string;
        onContentBg?: string;
        topBar?: ((props: NavBarStates) => React.ReactNode) | null;
        mainBar?: ((props: NavBarStates) => React.ReactNode) | null;
        bottomBar?: ((props: NavBarStates) => React.ReactNode) | null;
        theme?: ThemeMods;
    };

    menu?: {
        isIndexPage?: boolean;
        mainNavigation?: Array<ModxNavGroup>;
        subNavigation?: Array<ModxNavGroup>;
        header?: (props: NavMenuStates) => React.ReactNode;
        footer?: (props: NavMenuStates) => React.ReactNode;
        typeSettings: MenuTypeProps;
        theme?: ThemeMods;
    };
}

export const NewNavigationSlice: React.FC<NewNavigationSliceType> = ({
    navbar,
    menu,
    clampWidth,
}) => {
    return (
        <NewNavigation
            clampWidth={clampWidth}
            navBar={{
                ...navbar,
                topBar: navbar?.topBar,
                mainBar: navbar?.mainBar,
                bottomBar: navbar?.bottomBar,
            }}
            // FIXME:
            menu={{
                ...menu,
                mainNavigation: menu?.mainNavigation
                    ?.filter(filterNoLabelNoLink)
                    ?.map(mapToValidNavGroup),
                subNavigation: menu?.subNavigation
                    ?.filter(filterNoLabelNoLink)
                    ?.map(mapToValidNavGroup),
                typeSettings: {
                    ...menu?.typeSettings,
                    type: menu?.typeSettings.type || 'flyout',
                },
            }}
        />
    );
};

const filterNoLabelNoLink = (item: ModxNavGroup) => {
    return item.label && item?.link?.href;
};

const mapToValidNavGroup = (item: ModxNavGroup): NavItem => {
    return {
        link: {
            href: item?.link?.href === '/' ? '/' : '/' + item?.link?.href,
        },
        label: item.label || '',
        isCurrent: item?.isCurrent,
        subItems:
            item?.subItems && item.subItems.length > 0
                ? item.subItems.map(mapToValidNavGroup)
                : [],
    };
};
