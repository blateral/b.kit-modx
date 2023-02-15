import React, { lazy } from 'react';
import { assignTo, ThemeMods } from '@blateral/b.kit';
import { ModxNewsTeaser, ModxSlice, parseModxDateString } from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { LinkProps } from '@blateral/b.kit/types/components/typography/Link';
import { NewsItem } from '@blateral/b.kit/types/components/sections/news/NewsList';
import { TagProps } from '@blateral/b.kit/types/components/blocks/Tag';

const NewsList = lazy(() => import('imports/News/List'));

export interface NewsListSliceType
    extends ModxSlice<'NewsList', ModxNewsTeaser> {
    anchorId?: string;
    isActive?: boolean;
    bgMode?: 'full' | 'inverted';
    collectionId?: number;
    newsOverviewUrl?: string;
    bgColor?: string;
    hasImages?: boolean;
    mode?: 'short' | 'expanded';
    theme?: ThemeMods;
    customTag?: (props: {
        key: React.Key;
        name: string;
        isInverted?: boolean;
        isActive?: boolean;
        link?: LinkProps;
    }) => React.ReactNode;
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export const NewsListSlice: React.FC<NewsListSliceType> = ({
    bgMode,
    items,
    anchorId,
    mode,
    hasImages = true,
    newsOverviewUrl,
    customTag,
    cardAction,
    bgColor,
    theme,
}) => {
    // get background mode
    const news = mapNewsListData({
        newsCollection: items,
        hasImages,
        cardAction,
        newsCollectionUrl: newsOverviewUrl,
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
        <NewsList
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            bgMode={bgMode}
            mode={mode}
            customTag={customTag}
            news={news}
        />
    );
};

const sortFilterFn = (a: ModxNewsTeaser, b: ModxNewsTeaser) => {
    const dateA = generatePublicationDate(a.publishedOn || '');
    const dateB = generatePublicationDate(b.publishedOn || '');

    if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime();
    } else return 0;
};

function mapNewsListData({
    newsCollection,
    hasImages,
    cardAction,
    onTagClick,
    newsCollectionUrl,
}: {
    newsCollection: ModxNewsTeaser[] | undefined;
    hasImages?: boolean;
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    onTagClick?: (name?: string) => void;
    newsCollectionUrl?: string;
}): NewsItem[] {
    if (!newsCollection) return [];

    return newsCollection.sort(sortFilterFn).map((news) => {
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
            news?.tags?.split(',')?.map((tag) => tag.trim()) || [];

        const tagPropsArray = tagsArray.map((tag): TagProps => {
            return {
                name: tag,
                link: {
                    href: newsCollectionUrl
                        ? `/${newsCollectionUrl}`
                        : undefined,
                },
            };
        });

        return {
            image: hasImages ? mappedImage : undefined,
            tags: tagPropsArray,
            publishDate: publicationDate,
            title: news?.label || '',
            text: stripLinks(news.intro?.text),
            link: { href: news.link, isExternal: false },

            action:
                cardAction && news.link
                    ? (isInverted: boolean) =>
                          cardAction({
                              isInverted,
                              label: news?.readMeLabel || 'Beitrag lesen',
                              href: news.link,
                              isExternal: false,
                          })
                    : undefined,
            onTagClick: onTagClick || undefined,
        };
    });
}

const stripLinks = (text?: string) => {
    return text?.replace(/<a\b[^>]*>/i, '').replace(/<\/a>/i, '');
};

const generatePublicationDate = (
    publication_date?: string,
    first_publication_date?: string
) => {
    if (!publication_date && !first_publication_date) return undefined;
    try {
        return publication_date
            ? parseModxDateString(publication_date)
            : first_publication_date
            ? parseModxDateString(first_publication_date)
            : undefined;
    } catch {
        console.error('Error whlie generating publication date for news');
        return undefined;
    }
};
