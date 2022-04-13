import { assignTo, NewsOverview, ThemeMods } from '@blateral/b.kit';
import { TagProps } from '@blateral/b.kit/lib/components/blocks/Tag';
import { NewsItem } from '@blateral/b.kit/lib/components/sections/news/NewsOverview';
import React from 'react';
import { BgMode, ModxNewsTeaser, ModxSlice } from 'utils/modx';

export interface NewsOverviewSliceType
    extends ModxSlice<'NewsOverview', ModxNewsTeaser> {
    isActive?: boolean;
    anchor?: {
        id?: string;
        label?: string;
    };
    newsCollectionUrl?: string;
    hasImages?: boolean;
    bgMode?: BgMode;
    showMoreText?: string;
    collectionId?: number;
    queryParams?: Record<string, any>;
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
    onTagClick?: (tag: TagProps) => void;
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
    anchor,
    showMoreText,
    bgColor,
    theme,
    newsCollectionUrl,
    cardAction,
    onTagClick,
    customTag,
    items,
}) => {
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
        <NewsOverview
            theme={sliceTheme}
            anchorId={anchor?.id || ''}
            customTag={customTag}
            tags={generateUniqueTag(items)}
            onTagClick={onTagClick}
            news={
                mapNewsListData({
                    newsCollection: items,
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

function generateUniqueTag(newsCollection?: ModxNewsTeaser[]) {
    if (!newsCollection || newsCollection.length === 0) return [];

    let tagsString = '';

    newsCollection.map((news) => {
        tagsString += ',' + news.tags;
    });
    const tagsArray = tagsString.split(',').filter(Boolean);

    const uniqueTags = Array.from(new Set(tagsArray));

    return uniqueTags;
}

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
        ? newsCollection.map((news) => {
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
                  news?.tags && news.tags.length > 0
                      ? news.tags?.split(',')
                      : [];

              const tagPropsArray = tagsArray.map((tag): TagProps => {
                  return {
                      name: tag,
                      link: {
                          href: `/${newsCollectionUrl}?newsFilter=${tag}`,
                      },
                  };
              });

              const newsData = {
                  image: mappedImage,
                  publishDate: publicationDate,
                  title: news?.label || '',
                  text: news.intro?.text,
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
