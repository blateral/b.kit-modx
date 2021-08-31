import { NewsAuthorCard } from '@blateral/b.kit';
import React from 'react';
import { BgMode, ModxImageProps, ModxSlice } from 'utils/modx';

export interface NewsAuthorCardSliceType extends ModxSlice<'NewsAuthor'> {
    primary: {
        isActive?: boolean;
        bgMode?: BgMode;
        author_name?: string;
        author_image?: Pick<ModxImageProps, 'small' | 'meta'>;
        author_label?: string;
    };
}

export const NewsAuthorCardSlice: React.FC<NewsAuthorCardSliceType> = ({
    primary: { bgMode, author_name, author_image, author_label },
}) => {
    const mappedImage =
        {
            ...author_image,
            small: author_image?.small || '',
            alt: author_image?.meta?.altText || '',
        } || undefined;

    return (
        <NewsAuthorCard
            author={author_name}
            avatar={mappedImage && { src: mappedImage.small || '' }}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            label={author_label || 'Geschrieben von'}
        />
    );
};
