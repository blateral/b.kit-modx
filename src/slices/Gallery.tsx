import React from 'react';

import { assignTo, Gallery, ImageCarousel, Theme } from '@blateral/b.kit';
import { ResponsiveObject } from 'slices/slick';
import {
    BgMode,
    ModxImageProps,
    ModxImagePropsWithFormat,
    ModxSlice,
} from 'utils/modx';

type ImageFormats = 'square' | 'landscape' | 'landscape-wide' | 'portrait';
interface GalleryItems {
    image: ModxImagePropsWithFormat & { imageFormat: ImageFormats };
}

export interface GallerySliceType extends ModxSlice<'Gallery', GalleryItems> {
    isActive?: boolean;
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
    theme?: Theme;
}

export const GallerySlice: React.FC<GallerySliceType> = ({
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
        images: items?.map((item) => {
            const theImage: ModxImageProps =
                item[item?.image?.imageFormat || 'landscape'];
            return {
                ...theImage,
                small: theImage.small || '',
                alt: theImage.meta?.altText || '',
                isFull: item?.image?.imageFormat === 'landscape-wide',
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
        return (
            <Gallery
                {...sharedProps}
                theme={sliceTheme}
                // FIXME:
                bgMode={bgMode as any}
            />
        );
    }
};
