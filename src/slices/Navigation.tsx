import { Navigation, ThemeMods } from '@blateral/b.kit';
import {
    MenuTypeProps,
    NavItem,
} from '@blateral/b.kit/lib/components/sections/navigation/menu/Menu';

import {
    NavBarStates,
    NavMenuStates,
} from '@blateral/b.kit/lib/components/sections/navigation/Navigation';
import React from 'react';
import { ModxNavGroup, ModxSlice } from 'utils/modx';

export interface NavigationSliceType extends ModxSlice<'Navigation'> {
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

    customNavItemIcon?: (props: { icon?: string }) => React.ReactNode;
}

export const NavigationSlice: React.FC<NavigationSliceType> = ({
    navbar,
    menu,
    clampWidth,
    customNavItemIcon,
}) => {
    return (
        <Navigation
            clampWidth={clampWidth}
            navBar={{
                ...navbar,
                topBar: navbar?.topBar,
                mainBar: navbar?.mainBar,
                bottomBar: navbar?.bottomBar,
            }}
            menu={{
                ...menu,
                mainNavigation: menu?.mainNavigation
                    ?.filter(filterNoLabel)
                    ?.map((item) =>
                        mapToValidNavGroup(item, customNavItemIcon)
                    ),
                subNavigation: menu?.subNavigation
                    ?.filter(filterNoLabel)
                    ?.map((item) =>
                        mapToValidNavGroup(item, customNavItemIcon)
                    ),
                typeSettings: {
                    ...menu?.typeSettings,
                    type: menu?.typeSettings.type || 'flyout',
                },
            }}
        />
    );
};

const filterNoLabel = (item: ModxNavGroup) => {
    return !!item.label;
};

const mapToValidNavGroup = (
    item: ModxNavGroup,
    customNavItemIcon?: (props: { icon?: string }) => React.ReactNode
): NavItem => {
    return {
        ...item,
        uid: item.id || '',
        link: item.link?.href
            ? {
                  href: item.link.href === '/' ? '/' : '/' + item.link.href,
              }
            : undefined,
        label: item.label || '',
        subItems:
            item?.subItems && item.subItems.length > 0
                ? item.subItems.map((item) =>
                      mapToValidNavGroup(item, customNavItemIcon)
                  )
                : [],

        icon: customNavItemIcon ? (
            customNavItemIcon({ icon: item.icon })
        ) : item.icon ? (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                dangerouslySetInnerHTML={{ __html: item.icon }}
            />
        ) : undefined,
    };
};
