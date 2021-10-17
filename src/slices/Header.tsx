import {
    ModxImageProps,
    ModxMenuItemData,
    ModxSlice,
    SizeSelect,
    isExternalLink,
    isValidAction,
    endpoint,
} from 'utils/modx';

import { Header, Theme } from '@blateral/b.kit';
import React from 'react';

export interface HeaderSliceType extends ModxSlice<'Header', ModxImageProps> {
    isActive?: boolean;
    size?: SizeSelect;
    intro?: {
        title?: string;
        text?: string;
    };
    videoUrl?: string;
    badge?: Omit<ModxImageProps, 'meta'>;
    badgeOnMobile?: boolean;
    buttonstyle?: boolean;
    primary_label?: string;
    primary_link?: string;
    secondary_label?: string;
    secondary_link?: string;
    allowNavbarOverflow?: boolean;
    isNavLarge?: boolean;
    isInverted?: boolean;
    navInverted?: boolean;

    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
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

    // inject logo icon for into slice
    injectLogo?: (props: {
        isInverted?: boolean;
        size?: 'full' | 'small';
    }) => React.ReactNode;
    customTopGradient?: string;
    customBottomGradient?: string;
    search?: (isInverted?: boolean) => React.ReactNode;

    theme?: Theme;

    settingsPage?: ModxMenuItemData;
    pageAlias?: string;
}

export const HeaderSlice: React.FC<HeaderSliceType> = ({
    videoUrl,
    badge,
    badgeOnMobile,
    size,
    intro,
    buttonstyle,
    primary_label,
    primary_link,
    secondary_label,
    secondary_link,
    items,
    customBottomGradient,
    customTopGradient,
    primaryAction,
    secondaryAction,
    primaryActionPointer,
    secondaryActionPointer,
    theme,
}) => {
    // map header images
    const headerImageMap = items?.map(toComponentImageFormat) || undefined;

    return (
        <Header
            theme={theme}
            size={size || 'full'}
            videoUrl={videoUrl ? `${endpoint}${videoUrl}` : ''}
            images={headerImageMap}
            title={intro?.title || ''}
            intro={intro}
            badge={headerBadge(badge?.xlarge, badgeOnMobile)}
            primaryCta={getPrimaryButtonOrPointer({
                isCta: !buttonstyle,
                primary_label: primary_label,
                primary_link: primary_link,
                primaryAction,
                primaryActionPointer,
            })}
            secondaryCta={getSecondaryButtonOrPointer({
                isCta: !buttonstyle,
                secondary_label: secondary_label,
                secondary_link: secondary_link,
                secondaryAction,
                secondaryActionPointer,
            })}
            customTopGradient={customTopGradient}
            customBottomGradient={customBottomGradient}
        />
    );
};

function headerBadge(badgeUrl?: string, showOnMobile = true) {
    return badgeUrl
        ? {
              content: (
                  <img
                      src={badgeUrl || ''}
                      //FIXME: Missing meta tags
                      //   alt={badge?.meta?.altText || ''}
                      alt="Verzierung für die Kopfzeile"
                      style={{ height: '100%', width: '100%' }}
                  />
              ),
              showOnMobile: showOnMobile,
          }
        : undefined;
}

const getPrimaryButtonOrPointer = ({
    isCta,
    primaryAction,
    primaryActionPointer,
    primary_label,
    primary_link,
}: {
    isCta: boolean;
    primaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
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
    if (!primaryAction && !primaryActionPointer) return undefined;

    if (primaryAction && !primaryActionPointer) {
        return isValidAction(primary_label, primary_link)
            ? (isInverted: boolean) =>
                  primaryAction({
                      isInverted,
                      label: primary_label,
                      href: primary_link || '',
                      isExternal: isExternalLink(primary_link),
                  })
            : undefined;
    }
    if (!primaryAction && primaryActionPointer) {
        return isValidAction(primary_label, primary_link)
            ? (isInverted: boolean) =>
                  primaryActionPointer({
                      isInverted,
                      label: primary_label,
                      href: primary_link || '',
                      isExternal: isExternalLink(primary_link),
                  })
            : undefined;
    }

    if (isCta) {
        return primaryAction && isValidAction(primary_label, primary_link)
            ? (isInverted: boolean) =>
                  primaryAction({
                      isInverted,
                      label: primary_label,
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
    secondaryAction,
    secondaryActionPointer,
    secondary_label,
    secondary_link,
}: {
    isCta: boolean;
    secondaryAction?: (props: {
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
    secondary_label?: string;
    secondary_link?: string;
}) => {
    if (!secondaryAction && !secondaryActionPointer) return undefined;

    if (secondaryAction && !secondaryActionPointer) {
        return isValidAction(secondary_label, secondary_link)
            ? (isInverted: boolean) =>
                  secondaryAction({
                      isInverted,
                      label: secondary_label,
                      href: secondary_link || '',
                      isExternal: isExternalLink(secondary_link),
                  })
            : undefined;
    }
    if (!secondaryAction && secondaryActionPointer) {
        return isValidAction(secondary_label, secondary_link)
            ? (isInverted: boolean) =>
                  secondaryActionPointer({
                      isInverted,
                      label: secondary_label,
                      href: secondary_link || '',
                      isExternal: isExternalLink(secondary_link),
                  })
            : undefined;
    }

    if (isCta) {
        return secondaryAction && isValidAction(secondary_label, secondary_link)
            ? (isInverted: boolean) =>
                  secondaryAction({
                      isInverted,
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

const toComponentImageFormat = (item: ModxImageProps) => {
    return {
        ...item,
        small: item?.small || '',
        alt: item?.meta?.altText,
    };
};
