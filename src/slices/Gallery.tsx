import React from 'react';


import { Gallery, ImageCarousel } from '@blateral/b.kit';
import { ResponsiveObject } from 'slices/slick';
import { BgMode, mapImageToComponentData, ModxImagePropsWithFormat, ModxSlice } from 'utils/modx';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';


type ImageFormats = "square" | "landscape" | "landscape-wide" | "portrait";
interface GalleryItems {
     image: ModxImagePropsWithFormat & {format: ImageFormats} 

}

export interface GallerySliceType
    extends ModxSlice<
        'Gallery',GalleryItems
    > {
    primary: {
        isActive?: boolean;
        isCarousel?: boolean;
        bgMode?: BgMode;
        superTitle?: string;
        superTitleAs?: HeadlineTag;
        title?: string;
        titleAs?: HeadlineTag;
        text?: string;
    };

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
}


export const GallerySlice: React.FC<GallerySliceType> = ({
    primary: { isCarousel, bgMode, superTitle, superTitleAs, title, titleAs, text,  },
    items,
  
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
}) => {

    const sharedProps = {
        images: items?.map((item) => {
            return {
                ...mapImageToComponentData(item.image[item.image.format || "landscape"]),
                isFull: item.image.format === 'landscape-wide',
            };
        }),
    };

    if (isCarousel) {
        return (
            <ImageCarousel
                {...sharedProps}
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
                bgMode={
                    bgMode === 'full' || bgMode === 'inverted'
                        ? bgMode
                        : undefined
                }
            />
        );
    }
};
