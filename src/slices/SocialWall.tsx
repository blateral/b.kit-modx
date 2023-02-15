import React, { lazy } from 'react';
import { ModxSlice, ModxImageProps } from 'utils/modx';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { normalizeAnchorId } from 'utils/mapping';

const SocialWall = lazy(() => import('imports/SocialWall'));

type BgMode = 'full' | 'inverted';

interface WallItems {
    link?: string;
    image?: ModxImageProps;
}

export interface SocialWallSliceType
    extends ModxSlice<'SocialWall', WallItems> {
    isActive?: boolean;
    anchorId?: string;
    bgMode?: BgMode;
    bgColor?: string;
    followUs?: string;
    hashTag?: string;

    theme?: ThemeMods;
}

export const SocialWallSlice: React.FC<SocialWallSliceType> = ({
    bgMode,
    anchorId,
    bgColor,
    followUs,
    hashTag,
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

    return (
        <SocialWall
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            hashTag={hashTag}
            followUs={followUs}
            items={items?.map((item) => ({
                link: {
                    href: item.link,
                    isExternal: true,
                },
                image: item.image,
            }))}
        />
    );
};
