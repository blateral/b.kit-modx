import { assignTo, ThemeMods } from '@blateral/b.kit';
import { NewsImages } from '@blateral/b.kit/sections';
import React from 'react';
import { ModxImageProps, ModxSlice } from 'utils/modx';

export interface NewsImagesSliceType extends ModxSlice<'NewsImages'> {
    isActive?: boolean;
    text?: string;
    bgMode?: 'full' | 'inverted';
    full: Pick<ModxImageProps, 'small' | 'medium' | 'meta'>;
    half: Array<Pick<ModxImageProps, 'small' | 'medium' | 'large' | 'meta'>>;
    bgColor?: string;
    theme?: ThemeMods;
}

export const NewsImagesSlice: React.FC<NewsImagesSliceType> = ({
    bgMode,
    full,
    half,
    bgColor,
    theme,
}) => {
    const images = full?.small ? [full] : half[0]?.small ? half : [];

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
        <NewsImages
            theme={sliceTheme}
            bgMode={bgMode}
            images={images?.map((image) => {
                return {
                    ...image,
                    small: image.small || '',
                    alt: image.meta?.altText || '',
                    ratios: {
                        small: full?.small
                            ? { w: 983, h: 483 }
                            : { w: 452, h: 339 },
                    },
                };
            })}
        />
    );
};
