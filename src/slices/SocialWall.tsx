import { ModxSlice, ModxImageProps } from 'utils/modx';

import { assignTo, SocialWall, Theme } from '@blateral/b.kit';
import React from 'react';

type BgMode = 'full' | 'inverted';

interface WallItems {
    link?: string;
    image?: ModxImageProps;
}

export interface SocialWallSliceType
    extends ModxSlice<'SocialWall', WallItems> {
    isActive?: boolean;

    bgMode?: BgMode;
    bgColor?: string;
    followUs?: string;
    hashtag?: string;

    theme?: Theme;
}

export const SocialWallSlice: React.FC<SocialWallSliceType> = ({
    bgMode,
    bgColor,
    followUs,
    hashtag,
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
            bgMode={bgMode}
            hashtag={hashtag}
            followUs={followUs}
            items={items?.map((item) => ({
                link: {
                    href: item.link,
                    isExternal: true,
                },
                image: {
                    src: item?.image?.small || '',
                    alt: item?.image?.meta?.altText || '',
                },
            }))}
        />
    );
};
