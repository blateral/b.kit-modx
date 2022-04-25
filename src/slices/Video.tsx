import React from 'react';
import { assignTo, ThemeMods, Video, VideoCarousel } from '@blateral/b.kit';
import { ResponsiveObject } from './slick';
import { isBgModeString, ModxImageProps, ModxSlice } from 'utils/modx';

export interface VideoCardItem {
    bgImage: ModxImageProps;
    embedId: string;
}
export interface VideoSliceType extends ModxSlice<'Video', VideoCardItem> {
    isActive?: boolean;
    bgMode?: string;
    bgColor?: string;
    anchor?: {
        id?: string;
        label?: string;
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

    theme?: ThemeMods;
}

export const VideoSlice: React.FC<VideoSliceType> = ({
    bgMode,
    bgColor,
    items,
    anchor,
    controlNext,
    controlPrev,
    dot,
    beforeChange,
    afterChange,
    onInit,
    slidesToShow,
    responsive,
    playIcon,

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

    // if more than one items are defined create a carousel
    if (items && items.length > 1) {
        return (
            <VideoCarousel
                anchorId={anchor?.id || ''}
                theme={sliceTheme}
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
                anchorId={anchor?.id || ''}
                theme={sliceTheme}
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
