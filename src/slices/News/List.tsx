import { assignTo, NewsList, ThemeMods } from '@blateral/b.kit';
import { TagProps } from '@blateral/b.kit/lib/components/blocks/Tag';
import { NewsItem } from '@blateral/b.kit/lib/components/sections/news/NewsList';
import { LinkProps } from '@blateral/b.kit/lib/components/typography/Link';
import React from 'react';
import { BgMode, ModxNewsTeaser, ModxSlice } from 'utils/modx';

export interface NewsListSliceType
    extends ModxSlice<'NewsList', ModxNewsTeaser> {
    anchor?: {
        id?: string;
        label?: string;
    };
    isActive?: boolean;
    bgMode?: BgMode;
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
    anchor,
    mode,
    hasImages,
    newsOverviewUrl,
    customTag,
    cardAction,
    bgColor,
    theme,
}) => {
    // get background mode
    const newsListMap = mapNewsListData({
        newsCollection: items,
        hasImages,
        cardAction,
        newsCollectionUrl: newsOverviewUrl,
    });
    const filteredNews = removeFirstImagesIfMissingAtLeastOne(newsListMap);

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

    console.log('NEWESLIST');

    return (
        <NewsList
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            mode={mode}
            customTag={customTag}
            news={filteredNews}
        />
    );
};

function removeFirstImagesIfMissingAtLeastOne(
    mappedNews: NewsItem[],
    countToCheck = 2
) {
    const firstTwoItems = mappedNews.slice(0, countToCheck);
    const disableFirstImages = firstTwoItems.every(
        (news) => news?.image?.small
    );

    if (!disableFirstImages) {
        return mappedNews;
    } else {
        const mappedNewsCopy = [...mappedNews];
        for (let i = 0; i < countToCheck; i++) {
            mappedNewsCopy[i].image = undefined;
        }

        return mappedNewsCopy;
    }
}


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
        };

        const tagsArray =
            news?.tags && news.tags.length > 0 ? news.tags?.split(',') : [];

        const tagPropsArray = tagsArray.map((tag): TagProps => {
            return {
                name: tag,
                link: {
                    href: `/${newsCollectionUrl}?newsFilter=${encodeURIComponent(
                        tag
                    )}`,
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
                              label: news?.readMeLabel || 'Beitrag lesen',
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
