import React, { lazy } from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { ModxSlice, ModxImageProps } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const RawVideo = lazy(() => import('imports/RawVideo'));

export interface RawVideoCardItem {
    videos: string[];
    placeholderImg: ModxImageProps;
}

export interface RawVideoSliceType
    extends ModxSlice<'RawVideo', RawVideoCardItem> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted' | 'splitted';
    bgColor?: string;
    anchorId?: string;
    playIcon?: React.ReactNode;

    autoplay?: boolean;
    loop?: boolean;

    theme?: ThemeMods;
}

export const RawVideoSlice: React.FC<RawVideoSliceType> = ({
    bgMode,
    bgColor,
    anchorId,
    playIcon,
    items,

    autoplay,
    loop,

    theme,
    config,
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

    let videoUrl = items?.[0]?.videos?.[0];
    const placeholderImg = items?.[0]?.placeholderImg;
    if (videoUrl) {
        videoUrl = new URL(videoUrl, config.endpoint).href;
    }

    return (
        <RawVideo
            anchorId={normalizeAnchorId(anchorId)}
            theme={sliceTheme}
            bgMode={bgMode}
            videoUrls={videoUrl ? [videoUrl] : []}
            placeholderImg={placeholderImg}
            autoplay={autoplay}
            loop={loop}
            playIcon={playIcon}
        />
    );
};
