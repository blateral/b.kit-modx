import { NewsOverview } from '@blateral/b.kit';
import React from 'react';
import { BgMode, ModxNewsTeaser, ModxSlice } from 'utils/modx';

export interface NewsOverviewSliceType
    extends ModxSlice<'NewsOverview', ModxNewsTeaser> {
    isActive?: boolean;
    bgMode?: BgMode;
    showMoreText?: string;

    queryParams?: Record<string, any>;
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export const NewsOverviewSlice: React.FC<NewsOverviewSliceType> = ({
    bgMode,
    showMoreText,

    cardAction,
    queryParams,
    items,
}) => {
    // get background mode

    return (
        <NewsOverview
            tags={generateUniqueTag(items)}
            queryParams={queryParams}
            news={mapNewsListData(items, cardAction) || []}
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

function mapNewsListData(
    newsCollection: ModxNewsTeaser[] | undefined,
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode
) {
    return newsCollection?.map((news) => {
        const publicationDate = generatePublicationDate(news.publishedOn || '');

        const mappedImage = {
            ...news.intro?.image_preview,
            small: news.intro?.image_preview?.small || '',
            alt: news.intro?.image_preview?.meta?.altText || '',
        };

        const newsData = {
            image: mappedImage,
            tag: news?.tags?.split(',')[0] || '',
            publishDate: publicationDate,
            title: news.intro?.title || '',
            text: news.intro?.intro,
            link: { href: 'news/' + news.action.link, isExternal: false },

            secondaryAction:
                cardAction && news.action.label && news.action.link
                    ? (isInverted: boolean) =>
                          cardAction({
                              isInverted,
                              label: 'Beitrag lesen',
                              href: 'news/' + news.action.link,
                              isExternal: false,
                          })
                    : undefined,
        };

        return newsData;
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
