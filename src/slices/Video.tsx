import React from 'react';
import { Video, VideoCarousel } from '@blateral/b.kit';
import { ResponsiveObject } from './slick';
import { isBgModeString, ModxImageProps, ModxSlice } from 'utils/modx';

export interface VideoCardItem {
    bgImage: ModxImageProps;
    embedId: string;
}
export interface VideoSliceType extends ModxSlice<'Video', VideoCardItem> {
    primary: {
        is_active?: boolean;
        bgMode?: string;
    };

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
    primary: { bgMode },
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
                bgMode={isBgModeString(bgMode) ? bgMode : undefined}
                videos={items.map((item) => {
                    return {
                        embedId: item.embedId,
                        bgImage: item.bgImage,
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
        const embedId = items[0] && items[0].embedId;
        const bgImage = items[0] && items[0].bgImage;

        return (
            <Video
                bgMode={
                    isBgModeString(bgMode)
                        ? bgMode === 'full' || bgMode === 'inverted'
                            ? bgMode
                            : undefined
                        : undefined
                }
                bgImage={bgImage || {}}
                embedId={embedId}
                playIcon={playIcon}
            />
        );
    }
};
