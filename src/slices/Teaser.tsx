import { assignTo, Teaser, TeaserWide, Theme } from '@blateral/b.kit';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';
import React from 'react';
import { HeadlineTagDefault } from '../utils/stringLexicon';
import {
    isBgModeString,
    isExternalLink,
    isHeadlineTag,
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
    superTitle?: string;
    superTitleAs?: HeadlineTag;
    title?: string;
    titleAs?: HeadlineTag;
    intro?: string;
    text?: string;
    subText?: string;
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
    superTitle,
    superTitleAs,
    title,
    titleAs,
    intro,
    text,
    subText,
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
        superTitle,
        superTitleAs: superTitleAs,
        title: title,
        titleAs: titleAs,
        intro: intro,
        text: text,
        subText,

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
                superTitleAs={
                    isHeadlineTag(superTitleAs)
                        ? (superTitleAs as HeadlineTag)
                        : HeadlineTagDefault
                }
                titleAs={
                    isHeadlineTag(titleAs)
                        ? (titleAs as HeadlineTag)
                        : HeadlineTagDefault
                }
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
                superTitleAs={
                    isHeadlineTag(superTitleAs)
                        ? superTitleAs
                        : HeadlineTagDefault
                }
                titleAs={
                    isHeadlineTag(titleAs)
                        ? (titleAs as HeadlineTag)
                        : HeadlineTagDefault
                }
                bgMode={isBgModeString(bgMode) ? bgMode : undefined}
            />
        );
    }
};
