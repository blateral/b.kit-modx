import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { BgMode, ModxImageProps, ModxSlice } from 'utils/modx';

const NewsAuthorCard = React.lazy(() => import('imports/News/_AuthorCard'));

export interface NewsAuthorCardSliceType extends ModxSlice<'NewsAuthor'> {
    isActive?: boolean;
    bgMode?: BgMode;
    authorName?: string;
    authorImage?: Pick<ModxImageProps, 'small' | 'meta'>;
    authorLabel?: string;
    bgColor?: string;
    theme?: ThemeMods;
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
