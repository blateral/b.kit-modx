import { assignTo, Teaser, TeaserWide, Theme } from '@blateral/b.kit';
import React from 'react';
import {
    isBgModeString,
    isExternalLink,
    isValidAction,
    ModxImageProps,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';

export interface TeaserSliceType extends ModxSlice<'Teaser'> {
    isActive?: boolean;
    isMirrored?: boolean;
    isWide?: boolean;
    bgMode?: string;
    bgColor?: string;
    format?: string;
    text?: string;
    image?: ModxImagePropsWithFormat;
    description?: string;

    primary_link?: string;
    secondary_link?: string;
    primary_label?: string;
    secondary_label?: string;
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
    theme?: Theme;
}

export const TeaserSlice: React.FC<TeaserSliceType> = ({
    isMirrored,
    isWide,
    bgMode,
    bgColor,
    format,
    text,
    image,
    description,

    primary_link,
    primary_label,
    secondary_link,
    secondary_label,

    primaryAction,
    secondaryAction,
    theme,
}) => {
    const theImage: ModxImageProps = image && image[format || 'square'];

    const sharedProps = {
        isMirrored,

        text: text,

        primaryAction:
            primaryAction && isValidAction(primary_label, primary_link)
                ? (isInverted: boolean) =>
                      primaryAction({
                          isInverted,
                          label: primary_label,
                          href: primary_link || '',
                          isExternal: isExternalLink(primary_link),
                      })
                : undefined,
        secondaryAction:
            secondaryAction && isValidAction(secondary_label, secondary_link)
                ? (isInverted: boolean) =>
                      secondaryAction({
                          isInverted,
                          label: secondary_label,
                          href: secondary_link || '',
                          isExternal: isExternalLink(secondary_link),
                      })
                : undefined,
    };

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

    if (isWide) {
        return (
            <TeaserWide
                {...sharedProps}
                theme={sliceTheme}
                bgMode={isBgModeString(bgMode) ? bgMode : undefined}
                image={{
                    ...theImage,
                    small: theImage.small || '',
                    alt: image?.meta?.altText || '',
                    description: description,
                }}
            />
        );
    } else {
        return (
            <Teaser
                {...sharedProps}
                theme={sliceTheme}
                image={{
                    ...theImage,
                    small: theImage.small || '',
                    alt: image?.meta?.altText || '',
                    description: description,
                }}
                bgMode={isBgModeString(bgMode) ? bgMode : undefined}
            />
        );
    }
};
