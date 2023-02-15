import React from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { NewsFooter } from '@blateral/b.kit/sections';
import { ModxImageProps, ModxNewsTeaser, ModxSlice } from 'utils/modx';
import { TagProps } from '@blateral/b.kit/types/components/blocks/Tag';
import { LinkProps } from '@blateral/b.kit/types/components/typography/Link';
import { NewsItem } from '@blateral/b.kit/types/components/sections/news/NewsFooter';

export interface MappedNewsItem {
    image?: ModxImageProps;
    tags: TagProps[];
    publishDate?: Date;
    title: string;
    text?: string;
    link: LinkProps;
}
export interface NewsFooterSliceType
    extends ModxSlice<'NewsFooter', ModxNewsTeaser> {
    isActive?: boolean;
    isInverted?: boolean;
    newsFooterBackground?: boolean;
    newsOverviewUrl?: string;
    pageAlias?: string;
    hasImages?: boolean;
    bgColor?: string;
    theme?: ThemeMods;

    customTag?: (props: {
        key: React.Key;
        name: string;
        isInverted?: boolean;
        isActive?: boolean;
        link?: LinkProps;
    }) => React.ReactNode;

    // helpers to define component elements outside of slice
    secondaryAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export const NewsFooterSlice: React.FC<NewsFooterSliceType> = ({
    isInverted,
    pageAlias,
    hasImages = true,
    newsFooterBackground,
    newsOverviewUrl,
    items,
    customTag,
    secondaryAction,
    bgColor,
    theme,
}) => {
    const newsWithoutSelf = filterSelfFromNewsCollection(items, pageAlias);

    const newsListMap = mapNewsListData({
        newsCollection: newsWithoutSelf,
        cardAction: secondaryAction,
        newsOverviewUrl,
        hasImages,
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
        <NewsFooter
            theme={sliceTheme}
            news={newsListMap || []}
            bgMode={
                isInverted
                    ? 'inverted'
                    : newsFooterBackground
                    ? 'full'
                    : undefined
            }
            customTag={customTag}
        />
    );
};

function mapNewsListData({
    newsCollection,
    newsOverviewUrl,
    hasImages,
    cardAction,
    onTagClick,
}: {
    newsCollection: ModxNewsTeaser[] | undefined;
    newsOverviewUrl?: string;
    hasImages?: boolean;
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    onTagClick?: (name?: string) => void;
}): NewsItem[] {
    if (!newsCollection) return [];

    return newsCollection.map((news) => {
        let publicationDate = undefined;
        try {
            publicationDate = news.publishedOn
                ? generatePublicationDate(news.publishedOn)
                : undefined;
        } catch {
            publicationDate = undefined;
        }
        const mappedImage = {
            ...news.intro?.image_preview,
            small: news.intro?.image_preview?.small || '',
            alt: news.intro?.image_preview?.meta?.altText || '',
            ratios: {
                small: { w: 4, h: 3 },
            },
        };

        const tagsArray =
            news?.tags && news.tags.length > 0
                ? news.tags?.split(',').map((tag) => tag.trim())
                : [];

        const tagPropsArray = tagsArray.map((tag): TagProps => {
            return {
                name: tag,
                link: {
                    href: newsOverviewUrl ? `/${newsOverviewUrl}` : undefined,
                },
            };
        });
        return {
            image: hasImages ? mappedImage : undefined,
            tags: tagPropsArray,
            publishDate: publicationDate,
            title: news?.label || '',
            text: news.intro?.text,
            link: { href: news.link, isExternal: false },

            action:
                cardAction && news.link
                    ? (isInverted: boolean) =>
                          cardAction({
                              isInverted,
                              label: news.readMeLabel || 'Beitrag lesen',
                              href: news.link,
                              isExternal: false,
                          })
                    : undefined,
            onTagClick: onTagClick || undefined,
        };
    });
}

const generatePublicationDate = (
    publication_date?: string,
    first_publication_date?: string
) => {
    if (!publication_date && !first_publication_date) return undefined;
    try {
        return publication_date
            ? generatePublicationDateObject(publication_date)
            : first_publication_date
            ? new Date(first_publication_date)
            : undefined;
    } catch {
        console.error('Error whlie generating publication date for news');
        return undefined;
    }
};

function generatePublicationDateObject(publication_date?: string) {
    if (!publication_date) return undefined;

    const parts = publication_date?.split(' ').filter(Boolean);
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

const filterSelfFromNewsCollection = (
    items: ModxNewsTeaser[],
    pageAlias?: string
) => {
    return items.filter(
        (item) =>
            !pageAlias?.includes(item?.alias || 'HolymolyhumbugToasterino')
    );
};
