import React from 'react';

import { assignTo, ThemeMods } from '@blateral/b.kit';
import { BgMode, ModxImageProps, ModxSlice } from 'utils/modx';
import { LinkProps } from '@blateral/b.kit/types/components/typography/Link';
import { TagProps } from '@blateral/b.kit/types/components/blocks/Tag';
import { normalizeAnchorId } from 'utils/mapping';

const NewsIntro = React.lazy(() => import('imports/News/_Intro'));

export interface NewsIntroSliceType extends ModxSlice<'NewsIntro'> {
    anchorId?: string;
    isActive?: boolean;
    newsCollectionUrl?: string;
    newsOverviewUrl?: string;
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
    newsOverviewUrl,
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
              ratios: {
                  small: { w: 619, h: 348 },
              },
          }
        : undefined;

    const tagsArray =
        tags && tags.length > 0
            ? tags?.split(',')?.map((tag) => tag.trim())
            : [];
    const tagPropsArray = tagsArray.map((tag): TagProps => {
        return {
            name: tag,
            link: {
                href: newsOverviewUrl ? `/${newsOverviewUrl}` : undefined,
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
            anchorId={normalizeAnchorId(anchorId)}
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

export const getNewsIntroSearchData = (slice: NewsIntroSliceType) => {
    const data: string[] = [];
    if (slice?.newsHeading) data.push(slice.newsHeading);
    if (slice?.authorName) data.push(slice.authorName);
    if (slice?.newsIntro) data.push(slice.newsIntro);
    return data;
};
