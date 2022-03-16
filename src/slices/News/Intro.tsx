import React from 'react';

import { assignTo, NewsIntro, ThemeMods } from '@blateral/b.kit';
import { BgMode, ModxImageProps, ModxSlice } from 'utils/modx';

export interface NewsIntroSliceType extends ModxSlice<'NewsIntro'> {
    isActive?: boolean;
    newsHeading?: string;
    newsIntro?: string;
    newsImage?: ModxImageProps;
    authorName?: string;
    publicationDate?: string;
    bgMode?: BgMode;
    primary_link?: string;
    secondary_link?: string;
    primary_label?: string;
    secondary_label?: string;
    tags?: string;

    bgColor?: string;
    theme?: ThemeMods;
}

export const NewsIntroSlice: React.FC<NewsIntroSliceType> = ({
    bgMode,
    authorName,
    publicationDate,
    newsImage,
    newsIntro,
    newsHeading,
    bgColor,
    theme,
    tags,
}) => {
    const preppedPubDate = generatePublicationDateObject(publicationDate);
    const mappedImage = newsImage
        ? {
              ...newsImage,
              small: newsImage?.small || '',
              alt: newsImage?.meta?.altText || '',
          }
        : undefined;

    const tagsArray = tags && tags.length > 0 ? tags?.split(',') : [];

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
        <NewsIntro
            theme={sliceTheme}
            title={newsHeading}
            text={newsIntro}
            image={mappedImage}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            tags={tagsArray && tagsArray.length > 0 ? [tagsArray[0]] : []}
            onTagClick={(tag) => {
                window.location.href = `?selected=${encodeURI(tag)}`;
            }}
            meta={{
                author: authorName || '',
                date: preppedPubDate,
            }}
        />
    );
};
function generatePublicationDateObject(publicationDate?: string) {
    if (!publicationDate) return undefined;

    const parts = publicationDate?.split(' ').filter(Boolean);
    try {
        const dateParts = parts[0].split('-').filter(Boolean);

        const publicationDate = new Date(
            +dateParts[0],
            +dateParts[1] - 1,
            +dateParts[2]
        );

        return publicationDate;
    } catch (e) {
        console.error('Error in NewsIntro date generation. \n', e);
        return undefined;
    }
}
