import React from 'react';
import { assignTo, ThemeMods, useLibTheme } from '@blateral/b.kit';
import { isValidArray } from '@blateral/b.kit/lib/hooks';
import { TagProps } from '@blateral/b.kit/types/components/blocks/Tag';
import { NewsItem } from '@blateral/b.kit/types/components/sections/news/NewsOverview';
import {
    BgMode,
    ModxNewsTeaser,
    ModxSlice,
    parseModxDateString,
} from 'utils/modx';
import { normalizeAnchorId } from 'utils/mapping';
import { getFilterTagsArray } from 'utils/filterTags';

const NewsOverview = React.lazy(() => import('imports/News/_Overview'));

export interface NewsOverviewSliceType
    extends ModxSlice<'NewsOverview', ModxNewsTeaser> {
    isActive?: boolean;
    anchorId?: string;
    newsCollectionUrl?: string;
    hasImages?: boolean;
    bgMode?: BgMode;
    showMoreText?: string;
    collectionId?: number;
    queryParams?: Record<string, any>;
    cardAction?: (props: {
        key: React.Key;
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    onTagClick?: (tag: TagProps, insideList?: boolean | undefined) => void;
    customTag?: (props: {
        name: string;
        isInverted?: boolean;
        isActive?: boolean;
        clickHandler?: (ev?: React.SyntheticEvent<HTMLElement, Event>) => void;
    }) => React.ReactNode;
    bgColor?: string;
    theme?: ThemeMods;
}

export const NewsOverviewSlice: React.FC<NewsOverviewSliceType> = ({
    bgMode,
    hasImages,
    anchorId,
    showMoreText,
    bgColor,
    theme,
    newsCollectionUrl,
    cardAction,
    onTagClick,
    customTag,
    items,
    queryParams,
}) => {
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

    // get new theme (parent theme + sliceTheme) that is also used inside NewsOverview component
    const { theme: parentTheme } = useLibTheme();
    const filterName = assignTo(parentTheme, sliceTheme).globals.sections
        .newsFilterName;

    // get inital data from query params (serverside)
    const initialTags = getFilterTagsArray(queryParams?.[filterName]);
    const initialRows = queryParams?.rows
        ? parseInt(queryParams.rows)
        : undefined;

    const news = items || [];

    return (
        <NewsOverview
            theme={sliceTheme}
            anchorId={normalizeAnchorId(anchorId)}
            initial={{
                visibleRows: initialRows,
                activeTags: isValidArray(initialTags, false)
                    ? initialTags
                    : undefined,
            }}
            customTag={customTag}
            tags={getUniqueTags(news)}
            onTagClick={onTagClick}
            news={
                mapNewsListData({
                    newsCollection: news,
                    cardAction,
                    hasImages,
                    newsCollectionUrl,
                }) || []
            }
            bgMode={
                bgMode === 'full' || bgMode === 'inverted' ? bgMode : undefined
            }
            showMoreText={showMoreText}
        />
    );
};

const getUniqueTags = (collection: ModxNewsTeaser[]): string[] => {
    const tags: string[] = [];

    const newTags = collection?.reduce<string[]>((acc, current) => {
        const newsTags = current.tags?.split(',')?.map((tag) => tag.trim());
        if (!isValidArray(newsTags, false)) return acc;

        const tagsToAdd: string[] = [];
        for (const tag of newsTags) {
            if (acc.includes(tag) || tagsToAdd.includes(tag)) continue;
            tagsToAdd.push(tag);
        }

        return [...acc, ...tagsToAdd];
    }, []);

    if (isValidArray(newTags, false)) {
        tags.push(...newTags);
    }

    return tags;
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
    cardAction,
    hasImages,
    newsCollectionUrl,
}: {
    newsCollection: ModxNewsTeaser[] | undefined;
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    hasImages?: boolean;
    newsCollectionUrl?: string;
}): NewsItem[] {
    return newsCollection
        ? newsCollection.sort(sortFilterFn).map((news) => {
              const publicationDate = generatePublicationDate(
                  news.publishedOn || ''
              );

              const mappedImage = hasImages
                  ? {
                        ...news.intro?.image_preview,
                        small: news.intro?.image_preview?.small || '',
                        alt: news.intro?.image_preview?.meta?.altText || '',
                    }
                  : undefined;

              const tagsArray =
                  news?.tags?.split(',')?.map((tag) => tag.trim()) || [];

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

              const newsData = {
                  image: mappedImage,
                  publishDate: publicationDate,
                  title: news?.label || '',
                  text: stripLinks(news.intro?.text),
                  link: { href: news.link, isExternal: false },
                  tags: tagPropsArray,
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
              };

              return newsData;
          })
        : [];
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
