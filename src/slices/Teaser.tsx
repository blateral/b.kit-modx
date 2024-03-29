import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { HeadlineTag } from '@blateral/b.kit/types/components/typography/Heading';

import {
    isExternalLink,
    isValidAction,
    ModxImageProps,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const Teaser = React.lazy(() => import('imports/_Teaser'));
const TeaserWide = React.lazy(() => import('imports/_TeaserWide'));

export interface TeaserVideo {
    urls?: Array<string>;
    aspectRatios?: {
        small?: number;
    };
}
export interface TeaserSliceType extends ModxSlice<'Teaser'> {
    isActive?: boolean;
    anchorId?: string;
    theme?: ThemeMods;
    isMirrored?: boolean;
    bgMode?: 'full' | 'inverted' | 'splitted' | 'inverted-splitted';
    bgColor?: string;
    isWide?: boolean;
    format?: string;
    title?: string;
    titleAs?: HeadlineTag;
    superTitle?: string;
    superTitleAs?: HeadlineTag;
    text?: string;
    image?: ModxImagePropsWithFormat & { ratios: { w: number; h: number } };
    video?: TeaserVideo;
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
}

export const TeaserSlice: React.FC<TeaserSliceType> = ({
    isMirrored,
    isWide,
    bgMode,
    bgColor,
    format,
    anchorId,
    title,
    titleAs,
    superTitleAs,
    superTitle,
    text,
    image,
    video,
    description,

    primary_link,
    primary_label,
    secondary_link,
    secondary_label,

    primaryAction,
    secondaryAction,
    theme,
}) => {
    const aspectRatios = {
        square: { small: { w: 1, h: 1 } },
        landscape: { small: { w: 4, h: 3 } },
        portrait: { small: { w: 3, h: 4 } },
        'landscape-wide': { small: { w: 4, h: 3 }, semilarge: { w: 1, h: 1 } },
    };

    const selectedAspect: {
        small: { w: number; h: number };
        semilarge: { w: number; h: number };
    } = aspectRatios[format || 'square'];

    const theImage: ModxImageProps & {
        ratios?: {
            small: {
                w: number;
                h: number;
            };
        };
    } = image && {
        ...image[format || 'square'],
        ratios: selectedAspect,
    };

    const theVideo = {
        urls: video?.urls || [],
        aspectRatios: {
            small: selectedAspect.small.w / selectedAspect.small.h,
            semilarge:
                format === 'landscape-wide'
                    ? selectedAspect.semilarge.w / selectedAspect.semilarge.h
                    : undefined,
        },
    };

    const sharedProps = {
        anchorId: normalizeAnchorId(anchorId),
        isMirrored,
        title,
        titleAs,
        superTitle,
        superTitleAs,
        text: text,
        description: description,

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
                sectionBg: {
                    medium: bgColor || '',
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
                bgMode={bgMode as 'full' | 'inverted' | undefined}
                image={
                    theImage?.small
                        ? {
                              ...theImage,
                              small: theImage?.small || '',
                              alt: theImage?.meta?.altText || description || '',
                              copyright: theImage?.meta?.copyright || '',
                              ratios: theImage.ratios,
                          }
                        : undefined
                }
                video={
                    Array.isArray(theVideo.urls) && theVideo.urls.length > 0
                        ? theVideo
                        : undefined
                }
                primaryAction={
                    primaryAction && isValidAction(primary_label, primary_link)
                        ? (isInverted: boolean) =>
                              primaryAction({
                                  isInverted,
                                  label: primary_label,
                                  href: primary_link || '',
                                  isExternal: isExternalLink(primary_link),
                              })
                        : undefined
                }
                secondaryAction={
                    secondaryAction &&
                    isValidAction(secondary_label, secondary_link)
                        ? (isInverted: boolean) =>
                              secondaryAction({
                                  isInverted,
                                  label: secondary_label,
                                  href: secondary_link || '',
                                  isExternal: isExternalLink(secondary_link),
                              })
                        : undefined
                }
            />
        );
    } else {
        return (
            <Teaser
                {...sharedProps}
                theme={sliceTheme}
                image={{
                    ...theImage,
                    small: theImage?.small || '',
                    alt: image?.meta?.altText || description || '',
                    copyright: image?.meta?.copyright || '',
                }}
                video={
                    Array.isArray(theVideo.urls) && theVideo.urls.length > 0
                        ? theVideo
                        : undefined
                }
                bgMode={bgMode}
                primaryAction={
                    primaryAction && isValidAction(primary_label, primary_link)
                        ? (isInverted: boolean) =>
                              primaryAction({
                                  isInverted,
                                  label: primary_label,
                                  href: primary_link || '',
                                  isExternal: isExternalLink(primary_link),
                              })
                        : undefined
                }
                secondaryAction={
                    secondaryAction &&
                    isValidAction(secondary_label, secondary_link)
                        ? (isInverted: boolean) =>
                              secondaryAction({
                                  isInverted,
                                  label: secondary_label,
                                  href: secondary_link || '',
                                  isExternal: isExternalLink(secondary_link),
                              })
                        : undefined
                }
            />
        );
    }
};
