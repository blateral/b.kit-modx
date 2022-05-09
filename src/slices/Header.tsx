import {
    ModxImageProps,
    ModxSlice,
    SizeSelect,
    isExternalLink,
    isValidAction,
    endpoint,
} from 'utils/modx';

import { assignTo, Header, ThemeMods } from '@blateral/b.kit';
import React from 'react';
import { normalizeAnchorId } from 'utils/mapping';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';

type BgMode = 'full' | 'inverted';

export interface HeaderSliceType extends ModxSlice<'Header', ModxImageProps> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: BgMode;
    size?: SizeSelect;
    title?: string;
    titleAs?: HeadlineTag;
    text?: string;
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
    customImgOverlay,
    primary_label,
    primary_link,
    secondary_label,
    secondary_link,
    items,
    onImageChange,
    kenBurnsSettings,
    primaryAction,
    secondaryAction,
    theme,
    bgColor,
}) => {
    // map header images
    const headerImageMap = items?.map(toComponentImageFormat) || undefined;

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
        <Header
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            size={size || 'full'}
            isCentered={isCentered}
            videoUrl={videoUrl ? `${endpoint}${videoUrl}` : ''}
            images={headerImageMap}
            onImageChange={onImageChange}
            title={title || ''}
            titleAs={titleAs}
            text={text || ''}
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

const toComponentImageFormat = (item: ModxImageProps) => {
    return {
        ...item,
        small: item?.small || '',
        alt: item?.meta?.altText,
    };
};
