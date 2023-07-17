import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';

import {
    BgMode,
    isExternalLink,
    isValidAction,
    ModxImageProps,
    ModxSlice,
} from 'utils/modx';
import { isSVG, normalizeAnchorId } from 'utils/mapping';

const IconList = React.lazy(() => import('imports/_IconList'));

interface IconListImages {
    image: ModxImageProps & {
        originals?: {
            w?: number;
            h?: number;
        };
    };
    link: {
        href?: string;
        isExternal?: boolean;
    };
}

export interface IconListSliceType
    extends ModxSlice<'IconList', IconListImages> {
    isActive?: boolean;

    anchorId?: string;

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
    anchorId,
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
            anchorId={normalizeAnchorId(anchorId)}
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
            items={items?.map((item) => {
                const originalSize = item?.image?.originals;
                const aspectRatio =
                    originalSize?.w && originalSize?.h
                        ? {
                              w: originalSize.w,
                              h: originalSize.h,
                          }
                        : undefined;

                return {
                    src: item?.image?.small || '',
                    ratio: aspectRatio,
                    alt: item?.image?.meta?.altText || '',
                    link: item?.link?.href ? item.link : undefined,
                    showPlaceholder: !isSVG(item?.image?.small),
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
