import React from 'react';

import { NewsIntro } from '@blateral/b.kit';
import { BgMode, ModxImageProps, ModxSlice } from 'utils/modx';

export interface NewsIntroSliceType extends ModxSlice<'NewsIntro'> {
    primary: {
        isActive?: boolean;
        news_heading?: string;
        news_intro?: string;
        news_image?: ModxImageProps;
        author_name?: string;
        publicationDate?: string;
        bgMode?: BgMode;
        primary_link?: string;
        secondary_link?: string;
        primary_label?: string;
        secondary_label?: string;
    };
    tags?: string;
}

export const NewsIntroSlice: React.FC<NewsIntroSliceType> = ({
    primary: {
        bgMode,
        author_name,
        publicationDate,
        news_image,
        news_intro,
        news_heading,
    },

    tags,
}) => {
    const preppedPubDate = generatePublicationDateObject(publicationDate);
    const mappedImage = news_image
        ? {
              ...news_image,
              small: news_image?.small || '',
              alt: news_image?.meta?.altText || '',
          }
        : undefined;

    const tagsArray = tags?.split(',');
    return (
        <NewsIntro
            title={news_heading}
            text={news_intro}
            image={mappedImage}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            tags={tagsArray && tagsArray.length > 0 ? [tagsArray[0]] : []}
            onTagClick={(tag) => {
                window.location.href = `/news?selected=${encodeURI(tag)}`;
            }}
            meta={{
                author: author_name || '',
                date: preppedPubDate,
            }}
        />
    );
};
function generatePublicationDateObject(publicationDate?: string) {
    if (!publicationDate) return undefined;

    const parts = publicationDate?.split('/').filter(Boolean);
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
