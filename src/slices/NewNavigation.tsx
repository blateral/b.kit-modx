import { NewNavigation, ThemeMods } from '@blateral/b.kit';
import {
    MenuTypeProps,
    NavGroup,
    NavItem,
} from '@blateral/b.kit/lib/components/sections/navigation/remastered/menu/Menu';
import {
    NavBarStates,
    NavMenuStates,
} from '@blateral/b.kit/lib/components/sections/navigation/remastered/Navigation';
import React from 'react';
import { ModxSlice } from 'utils/modx';

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
        topBar?: (props: NavBarStates) => React.ReactNode | null;
        mainBar?: (props: NavBarStates) => React.ReactNode | null;
        bottomBar?: (props: NavBarStates) => React.ReactNode | null;
        theme?: ThemeMods;
    };

    menu?: {
        isIndexPage?: boolean;
        mainNavigation?: Array<NavGroup>;
        subNavigation?: Array<NavItem>;
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
        <NewNavigation clampWidth={clampWidth} navBar={navbar} menu={menu} />
    );
};

// export interface NavItem {
//     label: string;
//     link: LinkProps;
//     isCurrent?: boolean;
// }
// export interface NavGroup extends NavItem {
//     isFeatured?: boolean;
//     icon?: React.ReactNode;
//     subItems?: NavItem[];
// }
