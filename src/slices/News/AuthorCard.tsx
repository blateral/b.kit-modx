import { assignTo, NewsAuthorCard, Theme } from '@blateral/b.kit';
import React from 'react';
import { BgMode, ModxImageProps, ModxSlice } from 'utils/modx';

export interface NewsAuthorCardSliceType extends ModxSlice<'NewsAuthor'> {
    isActive?: boolean;
    bgMode?: BgMode;
    authorName?: string;
    authorImage?: Pick<ModxImageProps, 'small' | 'meta'>;
    authorLabel?: string;
    bgColor?: string;
    theme?: Theme;
}

export const NewsAuthorCardSlice: React.FC<NewsAuthorCardSliceType> = ({
    bgMode,
    authorName,
    authorImage,
    authorLabel,
    bgColor,
    theme,
}) => {
    if (!authorName) return null;
    const mappedImage =
        {
            ...authorImage,
            small: authorImage?.small || '',
            alt: authorImage?.meta?.altText || '',
        } || undefined;

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
        <NewsAuthorCard
            theme={sliceTheme}
            author={authorName}
            avatar={mappedImage && { src: mappedImage.small || '' }}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            label={authorLabel || 'Geschrieben von'}
        />
    );
};
