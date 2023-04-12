import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { ImageProps } from '@blateral/b.kit/types/components/blocks/Image';
import { HeadlineTag } from '@blateral/b.kit/types/components/typography/Heading';
import {
    HeaderFocus,
    HeaderImage,
} from '@blateral/b.kit/types/components/sections/header/Header';

import {
    ModxImageProps,
    ModxSlice,
    SizeSelect,
    isExternalLink,
    isValidAction,
} from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const Header = React.lazy(() => import('imports/_Header'));

type BgMode = 'full' | 'inverted';

export type HeaderSliceItem = ModxImageProps & { mobileImage?: string };

export interface HeaderSliceType extends ModxSlice<'Header', HeaderSliceItem> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: BgMode;
    size?: SizeSelect;
    title?: string;
    titleAs?: HeadlineTag;
    text?: string;
    forceTextOnImage?: boolean;
    onImageChange?: (
        image?: Omit<ImageProps, 'ratios' | 'coverSpace'> | undefined
    ) => void;
    customImgOverlay?: string;
    videoUrl?: string;

    primary_label?: string;
    primary_link?: string;
    secondary_label?: string;
    secondary_link?: string;

    bgColor?: string;
    isCentered?: boolean;
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

    kenBurnsSettings?: {
        interval?: number;
        zoom?: number;
        zoomPoint?: [number, number];
    };
    focusPointX?: 'left' | 'center' | 'right';
    focusPointY?: 'top' | 'center' | 'bottom';

    theme?: ThemeMods;
}

export const HeaderSlice: React.FC<HeaderSliceType> = ({
    anchorId,
    videoUrl,
    size,
    bgMode,
    isCentered,
    title,
    titleAs,
    text,
    forceTextOnImage,
    customImgOverlay,
    primary_label,
    primary_link,
    secondary_label,
    secondary_link,
    items,
    onImageChange,
    kenBurnsSettings,
    focusPointX,
    focusPointY,
    primaryAction,
    secondaryAction,
    theme,
    bgColor,
    config,
}) => {
    // map header images
    const headerImages = items?.map(toComponentImageFormat) || undefined;

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

    const focusPoint: HeaderFocus = [
        focusPointX || 'center',
        focusPointY || 'center',
    ];

    return (
        <Header
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            size={size || 'full'}
            isCentered={isCentered}
            videoUrl={videoUrl ? `${config?.endpoint}${videoUrl}` : ''}
            images={headerImages}
            focusPoint={focusPoint}
            onImageChange={onImageChange}
            title={title || ''}
            titleAs={titleAs}
            text={text || ''}
            textOnImage={forceTextOnImage}
            customImgOverlay={customImgOverlay}
            kenBurnsInterval={kenBurnsSettings?.interval}
            kenBurnsZoom={kenBurnsSettings?.zoom}
            kenBurnsZoomPoint={kenBurnsSettings?.zoomPoint}
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
};

const toComponentImageFormat = (item: HeaderSliceItem): HeaderImage => {
    return {
        ...item,
        small: item.mobileImage || item?.small || '',
        alt: item?.meta?.altText,
    };
};

export const getHeaderSearchData = (slice: HeaderSliceType): string[] => {
    const data: string[] = [];
    if (slice?.title) data.push(slice.title);
    if (slice?.text) data.push(slice.text);
    return data;
};
