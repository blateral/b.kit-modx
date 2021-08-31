import { NewsOverview } from '@blateral/b.kit';
import React from 'react';
import { ImageProps } from '@blateral/b.kit/lib/components/blocks/Image';
import {
    BgMode,
    isExternalLink,
    ModxImageProps,
    ModxNewsPage,
    ModxSlice,
} from 'utils/modx';
import { HeadlineTag } from '@blateral/b.kit/lib/components/typography/Heading';

export interface NewsOverviewSliceType
    extends ModxSlice<'NewsOverview', ModxNewsPage> {
    primary: {
        isActive?: boolean;
        bgMode?: BgMode;
        showMoreText?: string;
        superTitle?: string;
        superTitleAs?: HeadlineTag;
        title?: string;
        titleAs?: HeadlineTag;
    };

    queryParams?: Record<string, any>;
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode;
}

export const NewsOverviewSlice: React.FC<NewsOverviewSliceType> = ({
    primary: { bgMode, showMoreText },

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

function generateUniqueTag(newsCollection?: ModxNewsPage[]) {
    if (!newsCollection || newsCollection.length === 0) return [];

    const newsTagsCollection =
        newsCollection?.map((news) => {
            return news.news_tags?.split(',');
        }) || [];
    const flatNewsTags = flatten(newsTagsCollection);
    const uniqueNewsTags = Array.from(new Set(flatNewsTags));

    return uniqueNewsTags;
}

function mapNewsListData(
    newsCollection: ModxNewsPage[] | undefined,
    cardAction?: (props: {
        isInverted?: boolean;
        label?: string;
        href?: string;
        isExternal?: boolean;
    }) => React.ReactNode
) {
    return newsCollection?.sort(byDateDescending)?.map((news) => {
        const publicationDate = generatePublicationDate(
            news.publicationDate || ''
        );

        const mappedImage: ImageProps = createMappedImage(
            news.news_image_preview
        );

        const newsData = {
            image: mappedImage,
            tag: news.news_tags ? news.news_tags.split(',')[0] : undefined,
            publishDate: publicationDate,
            title: (news?.news_heading && news.news_heading) || '',
            text: news.news_intro && news.news_intro,
            link: { href: `/news/${news.id}`, isExternal: false },

            secondaryAction: cardAction
                ? (isInverted: boolean) =>
                      cardAction({
                          isInverted,
                          label: 'Beitrag lesen',
                          href: `/news/${news.id}`,
                          isExternal: isExternalLink(news.secondary_link),
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

const createMappedImage = (image?: ModxImageProps) => {
    return {
        ...image,
        small: image?.small || '',
        alt: image?.meta?.altText || '',
    };
};

const byDateDescending = (a: ModxNewsPage, b: ModxNewsPage) => {
    if (!a.publicationDate || !b.publicationDate) return 0;
    if (a.publicationDate > b.publicationDate) return -1;
    if (a.publicationDate < b.publicationDate) return 1;

    return 0;
};

// const byDateDescending = (a: ModxNewsPage, b: PrismicNewsPage) => {
//     let aDate: Date | undefined = new Date();
//     let bDate: Date | undefined = new Date();
//     if (a.publication_date && b.publication_date) {
//         aDate = generatePublicationDateObject(a.publication_date);
//         bDate = generatePublicationDateObject(b.publication_date);
//     } else if (!a.publication_date && b.publication_date) {
//         aDate = new Date(
//             a.first_publication_date || a.last_publication_date || ''
//         );
//         bDate = generatePublicationDateObject(b.data.publication_date);
//     } else if (a.data.publication_date && !b.data.publication_date) {
//         aDate = generatePublicationDateObject(a.data.publication_date);
//         bDate = new Date(
//             b.first_publication_date || b.last_publication_date || ''
//         );
//     } else if (!a.data.publication_date && !b.data.publication_date) {
//         aDate = new Date(
//             a.first_publication_date || a.last_publication_date || ''
//         );
//         bDate = new Date(
//             b.first_publication_date || b.last_publication_date || ''
//         );
//     } else {
//         return -1;
//     }

//     return (bDate as any) - (aDate as any);
// };

function flatten(arr: any[]): any[] {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(
            Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
        );
    }, []);
}

function generatePublicationDateObject(publication_date?: string) {
    if (!publication_date) return undefined;

    const parts = publication_date?.split('/').filter(Boolean);
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
