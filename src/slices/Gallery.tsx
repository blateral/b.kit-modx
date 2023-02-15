import React from 'react';

import { assignTo, ThemeMods } from '@blateral/b.kit';
import { Gallery } from '@blateral/b.kit/sections';
import { BgMode, ModxImageProps, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { ImageAspectRatios } from '@blateral/b.kit/types/components/blocks/Image';

type ImageFormats =
    | 'small-square'
    | 'wide-square'
    | 'small-landscape'
    | 'wide-landscape'
    | 'small-portrait'
    | 'wide-portrait';

interface ModxGalleryImageProps {
    'small-square'?: ModxImageProps;
    'small-landscape'?: ModxImageProps;
    'small-portrait'?: ModxImageProps;
    'wide-square'?: ModxImageProps;
    'wide-landscape'?: ModxImageProps;
    'wide-landscape-wide'?: ModxImageProps;
    'wide-portrait'?: ModxImageProps;
}

interface GalleryItems {
    image: ModxGalleryImageProps;
    imageFormat: ImageFormats;
}

export interface GallerySliceType extends ModxSlice<'Gallery', GalleryItems> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: BgMode;
    bgColor?: string;

    theme?: ThemeMods;
}

export const GallerySlice: React.FC<GallerySliceType> = ({
    anchorId,
    bgMode,
    bgColor,
    items,
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

    const aspectRatios = {
        square: { small: { w: 1, h: 1 } },
        landscape: { small: { w: 4, h: 3 } },
        portrait: { small: { w: 3, h: 4 } },
        'landscape-wide': { small: { w: 1440, h: 710 } },
    };

    return (
        <Gallery
            theme={sliceTheme}
            bgMode={bgMode}
            anchorId={normalizeAnchorId(anchorId)}
            images={items?.map((item) => {
                const isFull = item?.imageFormat?.includes('-wide');
                const format = item?.imageFormat || 'square';
                const theImage: ModxImageProps =
                    item[isFull ? format : `small-${format}`];
                const ratios: ImageAspectRatios = aspectRatios[format];

                return {
                    ...theImage,
                    small: theImage?.small || '',
                    alt: theImage?.meta?.altText || '',
                    isFull: isFull,
                    ratios: ratios || undefined,
                };
            })}
        />
    );
};
