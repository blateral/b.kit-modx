import { assignTo, IconList, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import {
    BgMode,
    isExternalLink,
    isValidAction,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';

interface IconListImages {
    image: ModxImageProps & {
        originals?: {
            w?: number;
            h?: number;
        };
    };
    sizes?: {
        w?: string;
        h?: string;
    };
    link: {
        href?: string;
        isExternal?: boolean;
    };
}

export interface IconListSliceType
    extends ModxSlice<'IconList', IconListImages> {
    isActive?: boolean;

    anchor?: {
        id?: string;
        label?: string;
    };

    isCentered?: boolean;
    showMoreText?: string;
    showLessText?: string;
    enableToggle?: boolean;
    bgMode?: BgMode;
    bgColor?: string;
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
    theme?: ThemeMods;
}

export const IconListSlice: React.FC<IconListSliceType> = ({
    bgMode,
    anchor,
    bgColor,
    isCentered,
    enableToggle,
    showLessText,
    showMoreText,
    primary_link,
    primary_label,
    secondary_link,
    secondary_label,
    items,
    primaryAction,
    secondaryAction,
    theme,
}) => {
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

    return (
        <IconList
            anchorId={anchor?.id || ''}
            theme={sliceTheme}
            enableToggle={enableToggle}
            isCentered={isCentered}
            bgMode={
                bgMode && (bgMode === 'full' || bgMode === 'inverted')
                    ? bgMode
                    : undefined
            }
            showMoreText={showMoreText}
            showLessText={showLessText}
            items={items.map((item) => {
                return {
                    src: item?.image?.small || '',
                    ratio:
                        item?.sizes?.w && item.sizes.h
                            ? {
                                  w: +item.sizes.w,
                                  h: +item.sizes.h,
                              }
                            : item.image.originals?.w && item.image.originals.h
                            ? {
                                  w: +item.image.originals.w,
                                  h: +item.image.originals.h,
                              }
                            : undefined,
                    alt: item?.image?.meta?.altText || '',
                    link: item?.link?.href ? item.link : undefined,
                };
            })}
            primaryAction={
                primaryAction && isValidAction(primary_label, primary_link)
                    ? (isInverted) =>
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
        />
    );
};
