import React from 'react';
import { Header } from '@blateral/b.kit';
import {
    isExternalLink,
    isValidAction,
    ModxImageProps,
    ModxMenuItemData,
    ModxSlice,
    SizeSelect,
} from 'utils/modx';

export interface HeaderSliceType extends ModxSlice<'Header', ModxImageProps> {
    isActive?: boolean;
    size?: SizeSelect;
    intro?: {
        title?: string;
        text?: string;
    };
    videoUrl?: string;
    badge?: string;
    badgeOnMobile?: boolean;
    headerButtonstyle?: boolean;
    header_primary_label?: string;
    header_primary_link?: string;
    header_secondary_label?: string;
    header_secondary_link?: string;

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

    settingsPage?: ModxMenuItemData;
    pageUrl?: string;
}

export const HeaderSlice: React.FC<HeaderSliceType> = ({
    videoUrl,
    badge,
    badgeOnMobile,
    size,
    intro,
    headerButtonstyle: header_buttonstyle,
    header_primary_label,
    header_primary_link,
    header_secondary_label,
    header_secondary_link,
    items,
    customBottomGradient,
    customTopGradient,
    primaryAction,
    secondaryAction,
    primaryActionPointer,
    secondaryActionPointer,
}) => {
    // map header images
    const headerImageMap = items.map(toComponentImageFormat);

    return (
        <Header
            size={size || 'full'}
            videoUrl={videoUrl || ''}
            images={headerImageMap}
            intro={intro}
            badge={headerBadge(badge, badgeOnMobile)}
            primaryCta={getPrimaryButtonOrPointer({
                isCta: !header_buttonstyle,
                primary_label: header_primary_label,
                primary_link: header_primary_link,
                primaryAction,
                primaryActionPointer,
            })}
            secondaryCta={getSecondaryButtonOrPointer({
                isCta: !header_buttonstyle,
                secondary_label: header_secondary_label,
                secondary_link: header_secondary_link,
                secondaryAction,
                secondaryActionPointer,
            })}
            customTopGradient={customTopGradient}
            customBottomGradient={customBottomGradient}
        />
    );
};

function headerBadge(badge?: string, showOnMobile = true) {
    return badge
        ? {
              content: (
                  <img
                      src={badge || ''}
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
