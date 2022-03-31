import { ModxSlice, ModxImageProps } from 'utils/modx';

import { assignTo, SocialWall, ThemeMods } from '@blateral/b.kit';
import React from 'react';

type BgMode = 'full' | 'inverted';

interface WallItems {
    link?: string;
    image?: ModxImageProps;
}

export interface SocialWallSliceType extends ModxSlice<'SocialWall', WallItems> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    bgMode?: BgMode;
    bgColor?: string;
    followUs?: string;
    hashTag?: string;

    theme?: ThemeMods;
}

export const SocialWallSlice: React.FC<SocialWallSliceType> = ({
    bgMode,
    anchor,
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
                mono: {
                    light: bgColor || '',
                },
            },
        },
        theme
    );

    return (
        <SocialWall
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
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
