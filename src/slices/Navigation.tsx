import React, { lazy } from 'react';
import { ThemeMods } from '@blateral/b.kit';
import {
    MenuTypeProps,
    NavItem,
} from '@blateral/b.kit/types/components/sections/navigation/menu/Menu';

import {
    NavBarStates,
    NavMenuStates,
} from '@blateral/b.kit/types/components/sections/navigation/Navigation';
import { ModxNavGroup, ModxSlice, PageContent } from 'utils/modx';

const Navigation = lazy(() => import('imports/Navigation'));

export interface NavigationSliceType extends ModxSlice<'Navigation'> {
    pageContent: PageContent[];
    clampWidth?: 'content' | 'full';
    navbar?: {
        isStickable?: boolean;
        isCollapsible?: boolean;
        /** @deprecated */
        pageFlow?: 'overContent' | 'beforeContent';
        allowNavbarHeaderOverflow?: boolean;
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
        navItemsHeader?: (props: NavMenuStates) => React.ReactNode;
        typeSettings: MenuTypeProps;
        theme?: ThemeMods;
    };

    customNavItemIcon?: (props: { icon?: string }) => React.ReactNode;
}

export const NavigationSlice: React.FC<NavigationSliceType> = ({
    pageContent,
    navbar,
    menu,
    clampWidth,
    customNavItemIcon,
}) => {
    // handle page flow behaviour
    const hasHeader = !!pageContent?.find(
        (slice) => slice.slice_type === 'Header'
    );
    let pageFlow: 'overContent' | 'beforeContent' = 'beforeContent';
    if (navbar?.pageFlow) {
        // if deprecated prop is used
        pageFlow = navbar.pageFlow;
    } else if (navbar?.allowNavbarHeaderOverflow && hasHeader) {
        pageFlow = 'overContent';
    }

    return (
        <Navigation
            clampWidth={clampWidth}
            navBar={{
                ...navbar,
                topBar: navbar?.topBar,
                mainBar: navbar?.mainBar,
                bottomBar: navbar?.bottomBar,
                pageFlow: pageFlow,
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
