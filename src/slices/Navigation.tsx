import {
    LogoProps,
    NavProps,
} from '@blateral/b.kit/lib/components/sections/navigation/Navigation';
import {
    ModxNavItem,
    ModxSettingsPage,
    SocialMediaItem,
    isExternalLink,
    isValidAction,
} from 'utils/modx';
import {
    FlyoutBackgroundSettings,
    NavGroup,
    NavItem,
} from '@blateral/b.kit/lib/components/sections/navigation/menu/Flyout';

import { Navigation, Theme } from '@blateral/b.kit';
import React from 'react';

export interface NavigationSliceType {
    nav_primaryAction?: (props: {
        isInverted?: boolean;
        size?: 'desktop' | 'mobile';
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    nav_secondaryAction?: (props: {
        isInverted?: boolean;
        size?: 'desktop' | 'mobile';
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export interface NavigationProps {
    pageAlias?: string;

    isLargeMenu?: boolean; // Global Settings
    isMenuInverted?: boolean; // Global Settings
    isTopbarInverted?: boolean; // Global Settings
    hideTopbarBackUnderMenu?: boolean; // Not Prismic
    isTopbarLargeOnPageTop?: boolean; // Not Prismic
    backdropOpacity?: number; // Not Prismic
    allowTopbarOverflow?: boolean; // Page Settings

    activeNavItem?: string;
    navItems?: NavGroup[];
    socialMapper?: (
        socials?: SocialMediaItem[],
        isInverted?: boolean
    ) => {
        href: string;
        icon: JSX.Element;
    }[];
    logo?: LogoProps;
    background?: FlyoutBackgroundSettings;

    primaryCta?: (props: {
        isInverted?: boolean;
        size?: 'desktop' | 'mobile';
        name?: string;
    }) => React.ReactNode;
    secondaryCta?: (props: {
        isInverted?: boolean;
        size?: 'desktop' | 'mobile';
        name?: string;
    }) => React.ReactNode;
    primaryActionPointer?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryActionPointer?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    search?: (isInverted?: boolean) => React.ReactNode;
    openMenuIcon?: (isInverted?: boolean) => React.ReactNode;
    closeMenuIcon?: (isInverted?: boolean) => React.ReactNode;
    theme?: Theme;
}

export const NavigationSlice: React.FC<
    NavigationProps & { pageAlias?: string; settings?: ModxSettingsPage }
> = ({
    pageAlias,
    socialMapper,
    settings,
    logo,
    background,
    primaryCta,
    secondaryCta,
    primaryActionPointer,
    secondaryActionPointer,
    allowTopbarOverflow,
    isTopbarLargeOnPageTop,
    theme,
    ...rest
}) => {
    const data = settings;
    const menu = createMenu({
        pageAlias,
        socials:
            socialMapper &&
            socialMapper(data?.socials, data?.flyoutMenu.isInverted),
        flyoutIsLarge: data?.flyoutMenu.isLarge,
        settingsData: data,
        flyoutIsInverted: data?.flyoutMenu.isInverted,
        navbarInverted: data?.navTopBar.navbarInverted,
        nav_primaryCtaFn: primaryCta,
        nav_secondaryCtaFn: secondaryCta,
        nav_primaryPointerFn: primaryActionPointer,
        nav_secondaryPointerFn: secondaryActionPointer,
        logo,
        background: background,
    });

    return (
        <Navigation
            {...menu}
            theme={theme}
            allowTopbarOverflow={allowTopbarOverflow}
            isTopbarLargeOnPageTop={isTopbarLargeOnPageTop}
            {...rest}
            isMirrored={data?.flyoutMenu.isMirrored || false}
        />
    );
};

interface MenuSliceType {
    settingsData?: ModxSettingsPage;
    pageAlias?: string;
    flyoutIsLarge?: boolean;
    flyoutIsInverted?: boolean;
    navbarInverted?: boolean;
    nav_primaryCtaFn?: (props: {
        isInverted?: boolean | undefined;
        label?: string | undefined;
        href?: string | undefined;
        isExternal?: boolean | undefined;
    }) => React.ReactNode;
    nav_secondaryCtaFn?: (props: {
        isInverted?: boolean | undefined;
        label?: string | undefined;
        href?: string | undefined;
        isExternal?: boolean | undefined;
    }) => React.ReactNode;
    nav_primaryPointerFn?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    nav_secondaryPointerFn?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;

    socials?: Array<{
        icon: React.ReactNode;
        href: string;
    }>;
    // inject logo icon into slice
    logo?: LogoProps;

    // flyout background options
    background?: FlyoutBackgroundSettings;

    // inject search into slice
    search?: (isInverted?: boolean) => React.ReactNode;
}
const createMenu = ({
    settingsData,
    pageAlias,
    flyoutIsLarge,
    flyoutIsInverted,
    navbarInverted,

    nav_primaryCtaFn,
    nav_secondaryCtaFn,
    nav_primaryPointerFn,
    nav_secondaryPointerFn,
    socials,
    logo,
    search,
}: MenuSliceType): NavProps => {
    const activeItemIndexes = getActiveNavGroupItem(
        settingsData?.menu.menuPrimary,
        pageAlias
    );

    const primaryMenu: NavGroup[] | undefined =
        settingsData?.menu.menuPrimary?.map(mapDataToPrimaryMenuItems);

    const logoLink = createCleanedLogoLink(settingsData?.logo?.link);

    return {
        isLargeMenu: flyoutIsLarge || false,
        isTopbarInverted: navbarInverted,
        isMenuInverted: flyoutIsInverted,
        logo: {
            icon: logo && logo.icon,
            link: logoLink,
            pageTopScale: logo && logo.pageTopScale,
            scrolledScale: logo && logo.scrolledScale,
        },
        socials: socials,
        search: search,

        primaryCta: ({ isInverted, size }) => {
            const primary = getPrimaryButtonOrPointer({
                isCta: !!settingsData?.navTopBar.buttonStyle,
                isInverted: !!isInverted,
                primary_label:
                    (size === 'desktop' ||
                    !settingsData?.navTopBar.navbarPrimary.labelShort
                        ? settingsData?.navTopBar.navbarPrimary.label
                        : settingsData?.navTopBar.navbarPrimary.labelShort) ||
                    '',
                primary_link: settingsData?.navTopBar.navbarPrimary.link,
                primaryAction: nav_primaryCtaFn,
                primaryActionPointer: nav_primaryPointerFn,
            });
            if (primary) {
                return primary(!!isInverted, size);
            } else {
                return undefined;
            }
        },
        secondaryCta: ({ isInverted, size }) => {
            const secondary = getSecondaryButtonOrPointer({
                isCta: !!settingsData?.navTopBar.buttonStyle,
                isInverted: !!isInverted,
                secondary_label:
                    (size === 'desktop' ||
                    !settingsData?.navTopBar.navbarSecondary.labelShort
                        ? settingsData?.navTopBar.navbarSecondary.label
                        : settingsData?.navTopBar.navbarSecondary.labelShort) ||
                    '',
                secondary_link: settingsData?.navTopBar.navbarSecondary.link,
                secondaryAction: nav_secondaryCtaFn,
                secondaryActionPointer: nav_secondaryPointerFn,
            });
            if (secondary) {
                return secondary(!!isInverted, size);
            } else {
                return undefined;
            }
        },

        activeNavItem: hasActiveNavGroup(activeItemIndexes)
            ? `navGroup${activeItemIndexes.groupId}.nav-link${activeItemIndexes.itemId}`
            : undefined,
        navItems: primaryMenu,
    };
};

const getPrimaryButtonOrPointer = ({
    isCta,
    isInverted,
    primaryAction,
    primaryActionPointer,
    primary_label,
    primary_link,
}: {
    isCta: boolean;
    isInverted: boolean;
    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        size?: 'desktop' | 'mobile';

        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    primaryActionPointer?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    primary_label?: string;
    primary_link?: string;
}) => {
    if (isCta) {
        return primaryAction && isValidAction(primary_label, primary_link)
            ? (isInverted: boolean, size?: 'mobile' | 'desktop') =>
                  primaryAction({
                      isInverted,
                      label: primary_label,
                      size,
                      href: primary_link || '',
                      isExternal: isExternalLink(primary_link),
                  })
            : undefined;
    }

    if (!isCta) {
        return primaryActionPointer &&
            isValidAction(primary_label, primary_link)
            ? (isInverted: boolean) =>
                  primaryActionPointer({
                      isInverted,
                      label: primary_label,
                      href: primary_link || '',
                      isExternal: isExternalLink(primary_link),
                  })
            : undefined;
    }

    return undefined;
};

const getSecondaryButtonOrPointer = ({
    isCta,
    isInverted,
    secondaryAction,
    secondaryActionPointer,
    secondary_label,
    secondary_link,
}: {
    isCta: boolean;
    isInverted: boolean;

    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        size?: 'desktop' | 'mobile';

        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryActionPointer?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondary_label?: string;
    secondary_link?: string;
}) => {
    if (isCta) {
        return secondaryAction && isValidAction(secondary_label, secondary_link)
            ? (isInverted: boolean, size?: 'mobile' | 'desktop') =>
                  secondaryAction({
                      isInverted,
                      size,
                      label: secondary_label,
                      href: secondary_link || '',
                      isExternal: isExternalLink(secondary_link),
                  })
            : undefined;
    }

    if (!isCta) {
        return secondaryActionPointer &&
            isValidAction(secondary_label, secondary_link)
            ? (isInverted: boolean) =>
                  secondaryActionPointer({
                      isInverted,
                      label: secondary_label,
                      href: secondary_link || '',
                      isExternal: isExternalLink(secondary_link),
                  })
            : undefined;
    }

    return undefined;
};

const getActiveNavGroupItem = (
    menuPrimary?: ModxNavItem[],
    pageAlias?: string
) => {
    const activeItemIndexes = {
        groupId: '',
        itemId: '',
    };

    //FIXME: Refactor this mess

    menuPrimary?.find((navGroup, groupIndex) => {
        const navItems = navGroup?.items;

        let navItem;
        if (navGroup.items.length > 0) {
            navItem = navItems?.find((navItem, itemIndex) => {
                if (navItem.alias === pageAlias) {
                    activeItemIndexes.groupId = groupIndex.toString();
                    activeItemIndexes.itemId = itemIndex.toString();
                    return true;
                } else return false;
            });
        } else if (navGroup.items.length === 0) {
            navGroup.items.push({
                id: navGroup.id,
                label: navGroup.label,
                link: navGroup.link,
                alias: navGroup.alias,
                items: [],
            });

            navItem = navItems?.find((navItem, itemIndex) => {
                if (navItem.alias === pageAlias) {
                    activeItemIndexes.groupId = groupIndex.toString();
                    activeItemIndexes.itemId = itemIndex.toString();
                    return true;
                } else return false;
            });
        }

        return !!navItem;
    });
    return activeItemIndexes;
};

const hasActiveNavGroup = (
    navGroupIndixes: { groupId: string; itemId: string } | null
) => {
    if (!navGroupIndixes) return false;
    return (
        'groupId' in navGroupIndixes &&
        navGroupIndixes.groupId &&
        'itemId' in navGroupIndixes &&
        navGroupIndixes.itemId
    );
};

const mapDataToPrimaryMenuItems = (navItem: ModxNavItem, index: number) => {
    if (navItem?.items?.length === 0) {
        return {
            id: `navGroup${index}`,
            label: '',
            isSmall: navItem?.isSmall || false,
            name: navItem?.navGroupLabel || '',

            items: [
                {
                    id: `nav-link${index}`,
                    label: navItem.label || '',

                    link: {
                        href: navItem.link || '',
                    },
                    onClick: (id: string, fullId: string) =>
                        console.log(fullId),
                },
            ],
        } as NavGroup;
    }

    return {
        id: `navGroup${index}`,
        label: navItem?.label || '',
        isSmall: navItem?.isSmall || false,
        name: navItem?.navGroupLabel || '',

        items:
            navItem.items &&
            navItem.items.map(
                (item: Omit<ModxNavItem, 'items'>, subindex: number) => {
                    return {
                        id: `nav-link${subindex}`,
                        name: item?.label || '',
                        label: item.label || '',

                        link: {
                            href: item.link || '',
                        },
                        onClick: (id: string, fullId: string) =>
                            console.log(fullId),
                    } as NavItem;
                }
            ),
    } as NavGroup;
};

const createCleanedLogoLink = (link?: string) => {
    return link && /index/.test(link)
        ? link.replace('index', '')
        : link
        ? link
        : '';
};
