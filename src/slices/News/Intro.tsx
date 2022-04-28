import React from 'react';

import { assignTo, NewsIntro, ThemeMods } from '@blateral/b.kit';
import { BgMode, endpoint, ModxImageProps, ModxSlice } from 'utils/modx';
import { LinkProps } from '@blateral/b.kit/lib/components/typography/Link';
import { TagProps } from '@blateral/b.kit/lib/components/blocks/Tag';

export interface NewsIntroSliceType extends ModxSlice<'NewsIntro'> {
    anchorId?: string;
    isActive?: boolean;
    newsCollectionUrl?: string;
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
    customTag?: (props: {
        key: React.Key;
        name: string;
        isInverted?: boolean;
        isActive?: boolean;
        link?: LinkProps;
    }) => React.ReactNode;
    bgColor?: string;
    theme?: ThemeMods;
}

export const NewsIntroSlice: React.FC<NewsIntroSliceType> = ({
    anchorId,
    bgMode,
    newsCollectionUrl,
    authorName,
    publicationDate,
    newsImage,
    newsIntro,
    newsHeading,
    bgColor,
    customTag,
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
    const tagPropsArray = tagsArray.map((tag): TagProps => {
        return {
            name: tag,
            link: {
                href: `${endpoint}${newsCollectionUrl}?newsFilter=${encodeURIComponent(
                    tag
                )}`,
            },
        };
    });

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
        <NewsIntro
            theme={sliceTheme}
            anchorId={anchorId || ''}
            title={newsHeading}
            text={newsIntro}
            image={mappedImage}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            tags={tagPropsArray}
            customTag={customTag}
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
