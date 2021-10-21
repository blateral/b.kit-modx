import { NewsAuthorCard } from '@blateral/b.kit';
import React from 'react';
import { BgMode, ModxImageProps, ModxSlice } from 'utils/modx';

export interface NewsAuthorCardSliceType extends ModxSlice<'NewsAuthor'> {
    isActive?: boolean;
    bgMode?: BgMode;
    authorName?: string;
    authorImage?: Pick<ModxImageProps, 'small' | 'meta'>;
    authorLabel?: string;
}

export const NewsAuthorCardSlice: React.FC<NewsAuthorCardSliceType> = ({
    bgMode,
    authorName,
    authorImage,
    authorLabel,
}) => {
    if (!authorName) return null;
    const mappedImage =
        {
            ...authorImage,
            small: authorImage?.small || '',
            alt: authorImage?.meta?.altText || '',
        } || undefined;

    return (
        <NewsAuthorCard
            author={authorName}
            avatar={mappedImage && { src: mappedImage.small || '' }}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            label={authorLabel || 'Geschrieben von'}
        />
    );
};
