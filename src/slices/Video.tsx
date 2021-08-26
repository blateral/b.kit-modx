import React from 'react';
import { AliasSelectMapperType } from 'utils/mapping';
import { Video, VideoCarousel } from '@blateral/b.kit';
import { ResponsiveObject } from './slick';
import { isBgModeString, ModxImageProps, ModxSlice } from 'utils/modx';

type BgMode = 'full' | 'splitted' | 'inverted';
export interface VideoCardItem {
    bg_image: ModxImageProps;
    embed_id: string;
}
export interface VideoSliceType extends ModxSlice<'Video', VideoCardItem> {
    primary: {
        is_active?: boolean;
        bg_mode?: string;
    };

    // helpers to define component elements outside of slice
    bgModeSelectAlias?: AliasSelectMapperType<BgMode>;
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
    playIcon?: React.ReactChild;
}

export const VideoSlice: React.FC<VideoSliceType> = ({
    primary: { bg_mode },
    items,

    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
    playIcon,
}) => {
    // get background mode

    // if more than one items are defined create a carousel
    if (items.length > 1) {
        return (
            <VideoCarousel
                bgMode={isBgModeString(bg_mode) ? bg_mode : undefined}
                videos={items.map((item) => {
                    return {
                        embedId: item.embed_id,
                        bgImage: item.bg_image,
                        playIcon: playIcon,
                    };
                })}
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
        // get first video item
        const embedId = items[0] && items[0].embed_id;
        const bgImage = items[0] && items[0].bg_image;

        return (
            <Video
                bgMode={
                    isBgModeString(bg_mode)
                        ? bg_mode === 'full' || bg_mode === 'inverted'
                            ? bg_mode
                            : undefined
                        : undefined
                }
                bgImage={bgImage}
                embedId={embedId}
                playIcon={playIcon}
            />
        );
    }
};
