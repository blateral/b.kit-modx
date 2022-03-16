import { assignTo, NewsImages, Theme } from '@blateral/b.kit';
import React from 'react';
import {
    BgMode,
    isExternalLink,
    isValidAction,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';

export interface NewsImagesSliceType extends ModxSlice<'NewsImages'> {
    isActive?: boolean;
    text?: string;
    bgMode?: BgMode;
    full: Pick<ModxImageProps, 'small' | 'medium' | 'meta'>;
    half: Array<Pick<ModxImageProps, 'small' | 'medium' | 'large' | 'meta'>>;
    bgColor?: string;
    theme?: Theme;
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

export const NewsImagesSlice: React.FC<NewsImagesSliceType> = ({
    bgMode,
    full,
    half,
    bgColor,
    theme,
    primary_link,
    primary_label,
    secondary_link,
    secondary_label,

    primaryAction,
    secondaryAction,
}) => {
    const images = full?.small ? [full] : half[0]?.small ? half : [];
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
    return (
        <NewsImages
            theme={sliceTheme}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
                          primaryAction &&
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
                    ? (isInverted) =>
                          secondaryAction({
                              isInverted,
                              label: secondary_label,
                              href: secondary_link || '',
                              isExternal: isExternalLink(secondary_link),
                          })
                    : undefined
            }
            images={images?.map((image) => {
                return {
                    ...image,
                    small: image.small || '',
                    alt: image.meta?.altText || '',
                };
            })}
        />
    );
};
