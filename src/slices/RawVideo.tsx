import React from 'react';
import { assignTo, ThemeMods, RawVideo } from '@blateral/b.kit';
import { ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

export interface RawVideoCardItem {
    videos: string[];
}

export interface RawVideoSliceType
    extends ModxSlice<'RawVideo', RawVideoCardItem> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted' | 'splitted';
    bgColor?: string;
    anchorId?: string;
    playIcon?: React.ReactNode;

    theme?: ThemeMods;
}

export const RawVideoSlice: React.FC<RawVideoSliceType> = ({
    bgMode,
    bgColor,
    anchorId,
    playIcon,
    items,

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
    if (videoUrl) {
        videoUrl = new URL(videoUrl, config.endpoint).href;
    }

    return (
        <RawVideo
            anchorId={normalizeAnchorId(anchorId)}
            theme={sliceTheme}
            bgMode={bgMode}
            videoUrls={videoUrl ? [videoUrl] : []}
            playIcon={playIcon}
        />
    );
};
