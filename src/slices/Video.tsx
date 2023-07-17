import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';

import { ModxImageProps, ModxSlice } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';

const Video = React.lazy(() => import('imports/_Video'));

export interface VideoCardItem {
    bgImage: ModxImageProps;
    embedId: string;
}

export interface VideoSliceType extends ModxSlice<'Video', VideoCardItem> {
    isActive?: boolean;
    bgMode?: 'full' | 'inverted' | 'splitted';
    bgColor?: string;
    anchorId?: string;
    playIcon?: React.ReactNode;

    consentText?: string;
    consentActionLabel?: string;
    consentAction?: (props: {
        label: string;
        handleClick?: () => void;
        consentProps: Record<string, string>;
    }) => React.ReactNode;
    /**
     * Custom handler for play button click
     * @returns true if video should be played
     */
    onPlayClick?: () => Promise<boolean>;

    theme?: ThemeMods;
}

export const VideoSlice: React.FC<VideoSliceType> = ({
    bgMode,
    bgColor,
    items,
    anchorId,
    playIcon,

    consentText,
    consentActionLabel,
    consentAction,
    onPlayClick,

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

    const embedId = items?.[0]?.embedId;
    const bgImage = items?.[0]?.bgImage;

    return (
        <Video
            anchorId={normalizeAnchorId(anchorId)}
            theme={sliceTheme}
            bgMode={bgMode}
            bgImage={bgImage || { small: '' }}
            embedId={embedId || ''}
            playIcon={playIcon}
            consentText={consentText}
            consentAction={
                consentAction && consentActionLabel
                    ? ({ consentProps, handleClick }) =>
                          consentAction({
                              consentProps,
                              handleClick,
                              label: consentActionLabel,
                          })
                    : undefined
            }
            onPlayClick={onPlayClick}
        />
    );
};
