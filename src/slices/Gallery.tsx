import React from 'react';

import { assignTo, Gallery, ImageCarousel, ThemeMods } from '@blateral/b.kit';
import { ResponsiveObject } from 'slices/slick';
import { BgMode, ModxImageProps, ModxSlice } from 'utils/modx';

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
    anchor?: {
        id?: string;
        label?: string;
    };
    isCarousel?: boolean;
    bgMode?: BgMode;
    bgColor?: string;

    // helpers to define component elements outside of slice
    controlNext?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    controlPrev?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        name?: string;
    }) => React.ReactNode;
    dot?: (props: {
        isInverted?: boolean;
        isActive?: boolean;
        index?: number;
    }) => React.ReactNode;
    beforeChange?: (props: { currentStep: number; nextStep: number }) => void;
    afterChange?: (currentStep: number) => void;
    onInit?: (steps: number) => void;
    slidesToShow?: number;
    responsive?: ResponsiveObject[];
    theme?: ThemeMods;
}

export const GallerySlice: React.FC<GallerySliceType> = ({
    anchor,
    isCarousel,
    bgMode,
    bgColor,
    items,

    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
    theme,
}) => {
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

    const sharedProps = {
        anchorId: anchor?.id || '',
        images: items?.map((item) => {
            const theImage: ModxImageProps =
                item[item?.imageFormat || 'small-square'];

            return {
                ...theImage,
                small: theImage?.small || '',
                alt: theImage?.meta?.altText || '',
                isFull: item?.imageFormat?.includes('wide-'),
            };
        }),
    };

    if (isCarousel) {
        return (
            <ImageCarousel
                {...sharedProps}
                theme={sliceTheme}
                bgMode={bgMode}
                controlNext={controlNext}
                controlPrev={controlPrev}
                beforeChange={beforeChange}
                afterChange={afterChange}
                onInit={onInit}
                dot={dot}
                slidesToShow={slidesToShow}
                responsive={responsive}
            />
        );
    } else {
        return <Gallery {...sharedProps} theme={sliceTheme} bgMode={bgMode} />;
    }
};
